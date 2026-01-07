import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import Cfg from '../config/config.js'

let msgCache = new Map()

export class YuRecall extends plugin {
  constructor () {
    super({
      name: 'Yu-防撤回',
      dsc: '检测撤回并转发',
      event: 'message.group,message.private,notice.group.recall,notice.friend.recall',
      priority: -100,
      rule: [
        {
          reg: '.*',
          fnc: 'recordMsg',
          log: false
        },
        {
          fnc: 'onRecall',
          event: 'notice.group.recall'
        },
        {
          fnc: 'onRecall',
          event: 'notice.friend.recall'
        }
      ]
    })
  }

  // --- 辅助日志函数 ---
  log (msg) {
    const cfg = Cfg.getAll()
    if (cfg.debug) {
      // 使用 logger.mark 让日志在控制台显眼一点（通常是紫色或蓝色）
      logger.mark(`[Yu-Recall-Debug] ${msg}`)
    }
  }

  async recordMsg (e) {
    if (!e.message_id) return false
    
    // 存入缓存
    msgCache.set(e.message_id, {
      msg: e.message,
      sender: e.sender,
      group_name: e.group_name || e.group?.name || '',
      group_id: e.group_id || '',
      is_group: !!e.group_id,
      friend_name: e.sender.nickname || e.sender.card || '',
      user_id: e.user_id,
      time: Date.now()
    })

    // 调试日志：记录动作
    // 只有开启调试模式才会看到这行刷屏
    // this.log(`已缓存消息 ID: ${e.message_id} 来自: ${e.user_id}`)

    setTimeout(() => {
      msgCache.delete(e.message_id)
    }, 125 * 1000)

    return false
  }

  async onRecall (e) {
    Cfg.reload()
    const cfg = Cfg.getAll()
    
    // 1. 检查总开关
    if (!cfg.enable) {
      // 关了就不打日志了，避免干扰
      return false
    }

    let recallMsgId = e.message_id
    this.log(`检测到撤回事件! ID: ${recallMsgId}, Operator: ${e.operator_id}`)

    // 2. 检查是否缓存
    if (!msgCache.has(recallMsgId)) {
      this.log(`缓存中未找到该消息 (可能时间太久或重启丢失)`)
      return false
    }
    
    let cached = msgCache.get(recallMsgId)
    let { msg, group_name, group_id, is_group, friend_name, user_id } = cached

    // 3. 检查权限
    let hasPerm = this.checkPermission(cfg, is_group, is_group ? group_id : user_id)
    if (!hasPerm) {
      this.log(`权限拦截: 当前模式=${cfg.globalMode ? '全局' : '白名单'}, 目标ID=${is_group ? group_id : user_id} 被忽略`)
      return false
    }

    // 4. 检查是否是主人
    let masters = this.e.bot.config.masterQQ || []
    if (masters.includes(e.operator_id)) {
      this.log(`撤回者是主人，跳过转发`)
      return false
    }

    // --- 发送 ---
    let headerText = ''
    if (is_group) {
      let gName = group_name || '未知群'
      headerText = `${gName} ${group_id} 撤回内容：\n`
    } else {
      headerText = `${friend_name} ${user_id} 撤回内容：\n`
    }

    let finalMsg = [headerText, ...msg]
    this.log(`准备发送给主人，内容预览: ${headerText.trim()}`)

    for (let master_id of masters) {
      if (master_id == user_id && !is_group) continue 

      try {
        await this.e.bot.pickFriend(master_id).sendMsg(finalMsg)
        this.log(`--> 发送给主人 ${master_id} 成功`)
        await common.sleep(500)
      } catch (err) {
        logger.error(`[Yu-Recall] 发送给主人失败: ${err}`)
      }
    }
    
    msgCache.delete(recallMsgId)
    return false
  }

  checkPermission (cfg, isGroup, id) {
    id = String(id)
    if (cfg.globalMode) {
      // 黑名单模式
      if (isGroup) return !cfg.blackListGroup.includes(id)
      return !cfg.blackListFriend.includes(id)
    } else {
      // 白名单模式
      if (isGroup) return cfg.whiteListGroup.includes(id)
      return cfg.whiteListFriend.includes(id)
    }
  }
}