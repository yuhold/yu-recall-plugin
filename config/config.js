import fs from 'fs'
import YAML from 'yaml'
import path from 'path'

const configPath = './plugins/yu-recall-plugin/config/system/'
const configFile = configPath + 'config.yaml'

// 默认配置
const defaultCfg = {
  enable: true, // 总开关
  globalMode: true, // true=全局开启(黑名单模式), false=指定开启(白名单模式)
  blackListGroup: [], // 黑名单群 (全局模式下，这些群不提示)
  whiteListGroup: [], // 白名单群 (指定模式下，只有这些群提示)
  blackListFriend: [], // 黑名单好友
  whiteListFriend: []  // 白名单好友
}

class Config {
  constructor () {
    this.config = {}
    this.init()
  }

  init () {
    if (!fs.existsSync(configPath)) fs.mkdirSync(configPath, { recursive: true })
    if (!fs.existsSync(configFile)) {
      fs.writeFileSync(configFile, YAML.stringify(defaultCfg))
    }
    this.reload()
  }

  reload () {
    try {
      this.config = YAML.parse(fs.readFileSync(configFile, 'utf8'))
    } catch (error) {
      this.config = defaultCfg
    }
  }

  get (key) {
    return this.config[key]
  }

  // 获取完整配置对象，给锅巴用
  getAll () {
    return this.config
  }

  // 保存配置，给锅巴用
  save (data) {
    this.config = { ...this.config, ...data }
    fs.writeFileSync(configFile, YAML.stringify(this.config))
  }
}

export default new Config()