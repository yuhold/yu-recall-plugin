import Cfg from './config/config.js'

// 语言包定义
const i18nData = {
  CN: {
    title: 'Yu防撤回',
    desc: '配置防撤回监听范围及模式',
    enable: '插件总开关',
    enableDesc: '是否启用防撤回功能',
    debug: '调试模式',
    debugDesc: '开启后控制台会输出详细日志，用于排查问题',
    lang: '界面语言 (Language)',
    langDesc: '切换面板语言，保存后刷新页面生效',
    global: '全局监听模式',
    globalDesc: '开启：默认监听所有，排除黑名单。\n关闭：默认不监听，只监听白名单。',
    blGroup: '群聊黑名单',
    blGroupDesc: '全局模式下，这些群【不】转发撤回',
    wlGroup: '群聊白名单',
    wlGroupDesc: '非全局模式下，【只】监听这些群',
    blFriend: '好友黑名单',
    blFriendDesc: '全局模式下，这些好友【不】转发撤回',
    wlFriend: '好友白名单',
    wlFriendDesc: '非全局模式下，【只】监听这些好友',
    placeholderGroup: '请输入群号，多个用逗号或回车分隔',
    placeholderFriend: '请输入QQ号，多个用逗号或回车分隔'
  },
  EN: {
    title: 'Yu-Recall',
    desc: 'Configure recall listener scope and mode',
    enable: 'Main Switch',
    enableDesc: 'Enable or disable the recall function',
    debug: 'Debug Mode',
    debugDesc: 'Output detailed logs to console for troubleshooting',
    lang: 'Interface Language',
    langDesc: 'Switch UI language. Refresh page after saving.',
    global: 'Global Mode',
    globalDesc: 'ON: Listen all, exclude Blacklist.\nOFF: Listen none, only Whitelist.',
    blGroup: 'Group Blacklist',
    blGroupDesc: 'Global Mode: These groups will NOT trigger recall.',
    wlGroup: 'Group Whitelist',
    wlGroupDesc: 'Specific Mode: ONLY these groups trigger recall.',
    blFriend: 'Friend Blacklist',
    blFriendDesc: 'Global Mode: These friends will NOT trigger recall.',
    wlFriend: 'Friend Whitelist',
    wlFriendDesc: 'Specific Mode: ONLY these friends trigger recall.',
    placeholderGroup: 'Enter Group IDs, separated by comma/enter',
    placeholderFriend: 'Enter User IDs, separated by comma/enter'
  }
}

export function supportGuoba () {
  // 获取当前语言配置
  const cfg = Cfg.getAll()
  const lang = cfg.language === 'EN' ? 'EN' : 'CN'
  const text = i18nData[lang]

  return {
    pluginInfo: {
      name: 'Yu-Recall',
      title: text.title,
      author: '@yuhold',
      authorLink: 'https://github.com/yuhold',
      link: 'https://github.com/yuhold',
      isV3: true,
      isCar: false,
      description: text.desc
    },
    configInfo: {
      schemas: [
        {
          field: 'enable',
          label: text.enable,
          bottomHelpMessage: text.enableDesc,
          component: 'Switch'
        },
        {
          field: 'debug',
          label: text.debug,
          bottomHelpMessage: text.debugDesc,
          component: 'Switch'
        },
        {
          field: 'language',
          label: text.lang,
          bottomHelpMessage: text.langDesc,
          component: 'Select',
          componentProps: {
            options: [
              { label: '简体中文', value: 'CN' },
              { label: 'English', value: 'EN' }
            ]
          }
        },
        {
          field: 'globalMode',
          label: text.global,
          bottomHelpMessage: text.globalDesc,
          component: 'Switch'
        },
        {
          field: 'blackListGroup',
          label: text.blGroup,
          bottomHelpMessage: text.blGroupDesc,
          component: 'InputTextArea',
          props: { placeholder: text.placeholderGroup }
        },
        {
          field: 'whiteListGroup',
          label: text.wlGroup,
          bottomHelpMessage: text.wlGroupDesc,
          component: 'InputTextArea',
          props: { placeholder: text.placeholderGroup }
        },
        {
          field: 'blackListFriend',
          label: text.blFriend,
          bottomHelpMessage: text.blFriendDesc,
          component: 'InputTextArea',
          props: { placeholder: text.placeholderFriend }
        },
        {
          field: 'whiteListFriend',
          label: text.wlFriend,
          bottomHelpMessage: text.wlFriendDesc,
          component: 'InputTextArea',
          props: { placeholder: text.placeholderFriend }
        }
      ],
      getConfigData () {
        return Cfg.getAll()
      },
      setConfigData (data, { Result }) {
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
        return Result.ok({}, 'Saved/已保存')
      }
    }
  }
}