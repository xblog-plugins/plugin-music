// 使用博客系统提供的接口
const widget =xBlog.widget
const database =xBlog.database
const tools =xBlog.tools
const router = xBlog.router
const net = xBlog.net
const cron = xBlog.cron

// 常量
const keyMusicContent = 'music_content'
const  keyMusicUserId = 'music_u'
const  keyMusicMusicId = 'music_id'
const  keyMusicSync = 'plugin_music_sync'
const  keyMusicSyncNow = 'plugin_music_sync_now'
const keyWebServer = 'site_api_server'

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

// 添加设置信息
widget.addSetting("音乐盒设置",1,[
    {title:"网易云用户id",type: "input",key: keyMusicUserId},
    {title:"网易云歌单id",type: "input",key: keyMusicMusicId},
    {title:"每日定时同步",type: "switch",key: keyMusicSync,default:false},
    {title:"立即同步",type: "row",key: keyMusicSyncNow,default:"admin/plugins/sideMusic"},
])

// 获取网易云歌单
function getMusicContent(context){
    // 设置头部信息
    let head = {
        origin: 'https://music.163.com',
        referer:' https://music.163.com/',
        Cookie : 'MUSIC_U=' + tools.getSetting(keyMusicUserId)
    }
    // 发送请求
    net.get('https://music.163.com/api/playlist/detail?id='+tools.getSetting(keyMusicMusicId),head,function (err, res) {
        if (!err){
            let server = tools.getSetting(keyWebServer)
            let data = []
            res = JSON.parse(res)
            if (res.code!==200){
                router.response.ResponseServerError(context,"获取歌词失败!")
                return false
            }
            res.result.tracks.forEach(function (item){
                data.push({
                    name: item.name,
                    artist: item.artists[0].name,
                    url: 'https://music.163.com/song/media/outer/url?id='+item.id,
                    cover: tools.strReplace(item.album.picUrl,'http:','',-1),
                    lrc: server + "/api/v3/plugins/sideMusic/" + item.id + "/irc"
                })
            })
            // 保存数据库
            tools.setSetting(keyMusicContent,data)
            router.response.ResponseOk(context,data)
        }
    })
}

//  网易云爬虫
router.registerAdminRouter("GET","",function (context){
    getMusicContent(context)
})


// 注册定时任务
cron.start("0 0 0 1/1 * ?",function () {
    if (tools.getSetting(keyMusicSync)){
        getMusicContent(null)
    }
})