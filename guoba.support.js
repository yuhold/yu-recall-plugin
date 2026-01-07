import Cfg from './config/config.js'

export function supportGuoba () {
  return {
    pluginInfo: {
      name: 'Yu-Recall',
      title: 'Yu防撤回',
      author: '@yuhold',
      authorLink: 'https://github.com/yuhold',
      link: 'https://github.com/yuhold',
      isV3: true,
      isCar: false,
      description: '配置防撤回监听范围及模式'
    },
    configInfo: {
      schemas: [
        {
          field: 'enable',
          label: '插件总开关',
          bottomHelpMessage: '是否启用防撤回功能',
          component: 'Switch'
        },
        {
          field: 'globalMode',
          label: '全局监听模式',
          bottomHelpMessage: '开启：默认监听所有，排除黑名单。\n关闭：默认不监听，只监听白名单。',
          component: 'Switch'
        },
        {
          field: 'blackListGroup',
          label: '群聊黑名单',
          bottomHelpMessage: '全局模式下，这些群【不】转发撤回',
          component: 'InputTextArea', // 也可以用 GTweenSelect 等高级组件，这里用文本框输入群号最通用
          props: { placeholder: '请输入群号，多个用逗号或回车分隔' }
        },
        {
          field: 'whiteListGroup',
          label: '群聊白名单',
          bottomHelpMessage: '非全局模式下，【只】监听这些群',
          component: 'InputTextArea',
          props: { placeholder: '请输入群号，多个用逗号或回车分隔' }
        },
        {
          field: 'blackListFriend',
          label: '好友黑名单',
          bottomHelpMessage: '全局模式下，这些好友【不】转发撤回',
          component: 'InputTextArea',
          props: { placeholder: '请输入QQ号，多个用逗号或回车分隔' }
        },
        {
          field: 'whiteListFriend',
          label: '好友白名单',
          bottomHelpMessage: '非全局模式下，【只】监听这些好友',
          component: 'InputTextArea',
          props: { placeholder: '请输入QQ号，多个用逗号或回车分隔' }
        }
      ],
      getConfigData () {
        return Cfg.getAll()
      },
      setConfigData (data, { Result }) {
        // 处理一下输入的字符串转数组
        const processList = (input) => {
          if (Array.isArray(input)) return input
          if (!input) return []
          return input.split(/[,，\n]/).map(i => i.trim()).filter(i => i)
        }

        data.blackListGroup = processList(data.blackListGroup)
        data.whiteListGroup = processList(data.whiteListGroup)
        data.blackListFriend = processList(data.blackListFriend)
        data.whiteListFriend = processList(data.whiteListFriend)

        Cfg.save(data)
        return Result.ok({}, '配置已保存')
      }
    }
  }
}