// 使用博客系统提供的接口
const widget =xBlog.widget
const database =xBlog.database
const tools =xBlog.tools

// 常量
const keyMusicContent = 'music_content'

// 添加卡片
widget.addSide("","index.html",function () {
    let content = tools.getSetting(keyMusicContent)
    tools.log(JSON.stringify(content))
    // 初始化数据库链接
    return {}
},true)


