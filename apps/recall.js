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

  // 1. 记录消息 (群聊 + 私聊)
  async recordMsg (e) {
    if (!e.message_id) return false
    
    // 存储关键信息
    msgCache.set(e.message_id, {
      msg: e.message, // 消息内容(数组)
      sender: e.sender, // 发送者信息
      group_name: e.group_name || e.group?.name || '', // 群名
      group_id: e.group_id || '', // 群号
      is_group: !!e.group_id, // 是否为群消息
      friend_name: e.sender.nickname || e.sender.card || '', // 好友名
      user_id: e.user_id, // 对方QQ
      time: Date.now()
    })

    // 2分钟后清理
    setTimeout(() => {
      msgCache.delete(e.message_id)
    }, 125 * 1000)

    return false
  }

  // 2. 处理撤回
  async onRecall (e) {
    // 重新加载配置，确保锅巴修改后立即生效
    Cfg.reload()
    const cfg = Cfg.getAll()
    
    // 总开关检查
    if (!cfg.enable) return false

    // 机器人自己撤回不处理
    if (e.operator_id === e.self_id) return false

    // 获取被撤回的消息
    let recallMsgId = e.message_id
    if (!msgCache.has(recallMsgId)) return false
    
    let cached = msgCache.get(recallMsgId)
    let { msg, group_name, group_id, is_group, friend_name, user_id } = cached

    // 权限检查 (Global模式 vs 指定模式)
    if (!this.checkPermission(cfg, is_group, is_group ? group_id : user_id)) {
      return false
    }

    // 获取主人QQ
    let masters = this.e.bot.config.masterQQ || []
    if (masters.includes(e.operator_id)) return false // 主人自己撤回不提示

    // --- 构建消息 ---
    let headerText = ''
    
    if (is_group) {
      // 格式: 群名字 群号 撤回内容
      // 如果没有获取到群名，就显示“未知群”
      let gName = group_name || '未知群'
      headerText = `${gName} ${group_id} 撤回内容：\n`
    } else {
      // 格式: 好友名字 好友qq号 撤回内容
      headerText = `${friend_name} ${user_id} 撤回内容：\n`
    }

    // 拼接消息
    let finalMsg = [headerText, ...msg]

    // 发送给主人
    for (let master_id of masters) {
      // 避免转发给自己造成递归（如果在私聊测试）
      if (master_id == user_id && !is_group) continue 

      try {
        await this.e.bot.pickFriend(master_id).sendMsg(finalMsg)
        await common.sleep(500)
      } catch (err) {
        // 发送失败忽略
      }
    }
    
    // 删缓存
    msgCache.delete(recallMsgId)
    return false
  }

  /**
   * 检查是否允许通知
   * @param {Object} cfg 配置对象
   * @param {Boolean} isGroup 是否群组
   * @param {String|Number} id 群号或QQ号
   */
  checkPermission (cfg, isGroup, id) {
    id = String(id) // 转字符串比对

    if (cfg.globalMode) {
      // --- 全局模式 (黑名单生效) ---
      if (isGroup) {
        // 如果在群黑名单里，返回 false
        return !cfg.blackListGroup.includes(id)
      } else {
        // 如果在好友黑名单里，返回 false
        return !cfg.blackListFriend.includes(id)
      }
    } else {
      // --- 指定模式 (白名单生效) ---
      if (isGroup) {
        // 只有在群白名单里，才返回 true
        return cfg.whiteListGroup.includes(id)
      } else {
        // 只有在好友白名单里，才返回 true
        return cfg.whiteListFriend.includes(id)
      }
    }
  }
}