import fs from 'fs'
import YAML from 'yaml'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configDir = path.join(__dirname, 'system')
const configFile = path.join(configDir, 'config.yaml')

// 默认配置增加了 debug 和 language
const defaultCfg = {
  enable: true,
  debug: false,      // <--- 新增：调试模式开关
  language: 'CN',    // <--- 新增：语言设置 CN/EN
  globalMode: true,
  blackListGroup: [],
  whiteListGroup: [],
  blackListFriend: [],
  whiteListFriend: []
}

class Config {
  constructor () {
    this.config = {}
    this.init()
  }

  init () {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
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

  getAll () {
    return this.config
  }

  save (data) {
    this.config = { ...this.config, ...data }
    fs.writeFileSync(configFile, YAML.stringify(this.config))
  }
}

export default new Config()