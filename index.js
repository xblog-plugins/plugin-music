// 使用博客系统提供的接口
const widget =xBlog.widget
const database =xBlog.database
const tools =xBlog.tools
const router = xBlog.router
const net = xBlog.net

// 常量
const keyMusicContent = 'music_content'

// 获取音乐歌词
router.registerRouter("GET","/:id/irc",function(context){
    net.get("http://music.163.com/api/song/media?id="+context.Param("id"),{"Host":"music.163.com"},function (err,res){
        if (err==null){
            let data = JSON.parse(res)
            if (data.lyric!==undefined){
                router.response.ResponseHtml(context,data.lyric)
                return
            }
        }
        router.response.ResponseHtml(context,"")
    })
})


// 添加卡片
widget.addSide("","index.html",function () {
    // 初始化数据库链接
    return {
        content: JSON.stringify(tools.getSetting(keyMusicContent))
    }
},true)


