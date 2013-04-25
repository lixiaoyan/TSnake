(function(){
    "use strict";
    var TSnakeEX={};
    TSnakeEX.toString=Object.prototype.toString;
    TSnakeEX.getHandle=function(handle){
        return handle || function(){};
    };
    TSnakeEX.assert=function(bool,msg){
        if(!bool){
            TSnakeEX.error(msg);
        }
    };
    TSnakeEX.Break=function(){};
    TSnakeEX.Continue=function(){};
    TSnakeEX.error=function(msg){
        throw msg;
    };
    TSnakeEX.each=function(object,handle,prototype){
        if(TSnakeEX.toString.call(object)=="[object Array]"){
            for(var key=0,len=object.length;key<len;key++){
                try{
                    handle.call(object[key],key,object[key]);
                }catch(e){
                    if(e instanceof TSnakeEX.Break){
                        break;
                    }else if(e instanceof TSnakeEX.Continue){
                        continue;
                    }else{
                        TSnakeEX.error(e);
                    }
                }
            }
        }else{
            for(var key in object){
                if(prototype || !object.hasOwnProperty || object.hasOwnProperty(key)){
                    try{
                        handle.call(object[key],key,object[key]);
                    }catch(e){
                        if(e instanceof TSnakeEX.Break){
                            break;
                        }else if(e instanceof TSnakeEX.Continue){
                            continue;
                        }else{
                            TSnakeEX.error(e);
                        }
                    }
                }
            }
        }
    };
    TSnakeEX.extend=function(receiver,supplier,deepclone,overwrite,prototype){
        TSnakeEX.each(supplier,function(k,v){
            if(overwrite || !(k in receiver)){
                if(deepclone){
                    if(TSnakeEX.toString.call(v)=="[object Object]" && !(v.toString && v.toString()=="[object]")){
                        receiver[k]=TSnakeEX.extend({},v,deepclone,overwrite,prototype);
                    }else if(TSnakeEX.toString.call(v)=="[object Array]"){
                        receiver[k]=TSnakeEX.extend([],v,deepclone,overwrite,prototype);
                    }else{
                        receiver[k]=v;
                    }
                }else{
                    receiver[k]=v;
                }
            }
        },prototype);
        return receiver;
    };
    TSnakeEX.Class=function(constructor,config){
        constructor=constructor || function(){};
        config=config || {};
        var subClass;
        if(config.extend){
            if(TSnakeEX.toString.call(config.extend)=="[object Object]"){
                if(config.extend.prototype || config.extend.constructor){
                    if(config.extend.constructor){
                        subClass=function(){
                            config.extend.constructor.apply(this,arguments);
                            var r=constructor.apply(this,arguments);
                            if(r!==undefined){
                                return r;
                            }
                        };
                        TSnakeEX.extend(subClass,config.extend.constructor,true,true);
                    }else{
                        subClass=function(){
                            var r=constructor.apply(this,arguments);
                            if(r){
                                return r;
                            }
                        };
                    }
                    if(config.extend.prototype){
                        if(TSnakeEX.toString.call(config.extend.prototype)=="[object Object]"){
                            var tempClass=function(){};
                            tempClass.prototype=config.extend.prototype;
                            subClass.prototype=new tempClass();
                        }else{
                            subClass.prototype=new config.extend.prototype();
                        }
                    }
                }else{
                    subClass=function(){
                        var r=constructor.apply(this,arguments);
                        if(r){
                            return r;
                        }
                    };
                }
            }else{
                subClass=function(){
                    config.extend.apply(this,arguments);
                    var r=constructor.apply(this,arguments);
                    if(r){
                        return r;
                    }
                };
                TSnakeEX.extend(subClass,config.extend,true,true);
                subClass.prototype=new config.extend();
            }
        }else{
            subClass=function(){
                var r=constructor.apply(this,arguments);
                if(r!==undefined){
                    return r;
                }
            };
        }
        subClass.prototype.constructor=subClass;
        if(config.method){
            TSnakeEX.extend(subClass,config.method,true,true);
        }
        if(config.prototype){
            TSnakeEX.extend(subClass.prototype,config.prototype,true,true);
        }
        return subClass;
    };
    TSnakeEX.param=function(param){
        if(typeof param=="string"){
            return param;
        }
        var arr=[];
        TSnakeEX.each(param,function(key,value){
            arr.push(encodeURIComponent(key)+"="+encodeURIComponent(value));
        });
        return arr.join("&");
    };
    TSnakeEX.ajax=function(config){
        config=TSnakeEX.extend({
            type:"GET",
            url:window.location.href,
            data:{},
            contentType:"application/x-www-form-urlencoded",
            async:true,
            success:function(){},
            error:function(){}
        },config,true,true);
        config.xhr=config.xhr || window.XMLHttpRequest?new window.XMLHttpRequest():new window.ActiveXObject("Microsoft.XMLHTTP");
        config.type=config.type.toUpperCase();
        config.data=TSnakeEX.param(config.data);
        if(config.data && config.type==="GET"){
            config.url+=(/\?/.test(config.url)?"&":"?")+config.data;
        }
        config.xhr.open(config.type,config.url,config.async);
        config.xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
        config.xhr.setRequestHeader("Content-Type",config.contentType);
        config.xhr.send(config.type==="GET"?null:config.data);
        config.xhr.onreadystatechange=function(){
            if(config.xhr.readyState==4){
                if((config.xhr.status>=200 && config.xhr.status<300) || config.xhr.status==304 || config.xhr.status==1223){
                    config.success.call(config.xhr,config.xhr);
                }else{
                    config.error.call(config.xhr,config.xhr);
                }
            }
        };
        return config.xhr;
    };
    TSnakeEX.Array={};
    TSnakeEX.Array.indexOf=function(arr,value){
        var result=-1;
        TSnakeEX.each(arr,function(k,v){
            if(v===value){
                result=k;
                throw new TSnakeEX.Break();
            }
        });
        return result;
    };
    TSnakeEX.Array.remove=function(arr,value){
        if(TSnakeEX.array.indexOf(arr,value)!=-1){
            arr.splice(TSnakeEX.array.indexOf(arr,value),1);
        }
    };
    TSnakeEX.String={};
    TSnakeEX.String.format=function(str){
        TSnakeEX.each(Array.prototype.slice.call(arguments,1),function(k,v){
            str=str.replace(new RegExp("\\{"+k+"\\}","g"),v);
        });
        return str;
    };
    TSnakeEX.String.fill=function(length,fill){
        length=length || 0;
        fill=fill || " ";
        var add=[];
        for(var i=0;i<length;i++){
            add.push(fill);
        }
        return add.join("");
    };
    TSnakeEX.String.leftFill=function(str,length,fill){
        return TSnakeEX.String.fill(length-str.length,fill)+str;
    };
    TSnakeEX.String.rightFill=function(str,length,fill){
        return str+TSnakeEX.String.fill(length-str.length,fill);
    };
    TSnakeEX.String.trim=function(str){
        return TSnakeEX.String.trimLeft(TSnakeEX.String.trimRight(str));
    };
    TSnakeEX.String.trimLeft=function(str){
        return str.replace(/^\s+/,"");
    };
    TSnakeEX.String.trimRight=function(str){
        return str.replace(/\s+$/,"");
    };
    TSnakeEX.String.replace=function(arr,a,b){
        if(typeof arr=="string"){
            if(typeof a=="function"){
                return a.call(arr);
            }else{
                return String.prototype.replace.call(arr,a,b);
            }
        }else{
            var r;
            if(TSnakeEX.toString.call(arr)=="[object Array]"){
                r=[];
            }else{
                r={};
            }
            TSnakeEX.each(arr,function(k,v){
                r[k]=TSnakeEX.String.replace(v,a,b);
            });
            return r;
        }
    };
    TSnakeEX.Color={};
    TSnakeEX.Color.FLAG_TO_NUM=1<<0;
    TSnakeEX.Color.FLAG_TO_STR=1<<1;
    TSnakeEX.Color.FLAG_TO_RGB=1<<2;
    TSnakeEX.Color.FLAG_TO_HEX=1<<3;
    TSnakeEX.Color.FLAG_TO_HSL=1<<4;
    TSnakeEX.Color.convert=function(flag){
        if(flag & TSnakeEX.Color.FLAG_TO_NUM){
            var f;
            var m;
            var str=arguments[1];
            if((f=0,m=str.match(/^rgb\((\d+),(\d+),(\d+)\)$/)) || (f=1,m=str.match(/^#(.*?)$/))){
                if(f==0){
                    if(flag & TSnakeEX.Color.FLAG_TO_RGB){
                        var n=parseInt(m[1],16);
                        var r=(n>>16) & 255;
                        var g=(n>>8) & 255;
                        var b=(n) & 255;
                        return [r,g,b];
                    }
                    if(flag & TSnakeEX.Color.FLAG_TO_HEX){
                        var n=parseInt(m[1],16);
                        return n;
                    }
                }
                if(f==1){
                    if(flag & TSnakeEX.Color.FLAG_TO_RGB){
                        var r=parseInt(m[1]);
                        var g=parseInt(m[2]);
                        var b=parseInt(m[3]);
                        return [r,g,b];
                    }
                    if(flag & TSnakeEX.Color.FLAG_TO_HEX){
                        var r=parseInt(m[1]);
                        var g=parseInt(m[2]);
                        var b=parseInt(m[3]);
                        var n=(r<<16)+(g<<8)+(b);
                        return n;
                    }
                }
            }
            if(m=str.match(/^hsl\((\d+),(\d+%?),(\d+%?)\)$/)){
                if(flag & TSnakeEX.Color.FLAG_TO_HSL){
                    var h=parseInt(m[1]);
                    var s=/%$/.test(m[2])?parseInt(m[2].replace(/%$/,""))/100:parseInt(m[2]);
                    var l=/%$/.test(m[3])?parseInt(m[3].replace(/%$/,""))/100:parseInt(m[3]);
                    return [h,s,l];
                }
            }
        }
        if(flag & TSnakeEX.Color.FLAG_TO_STR){
            if(flag & TSnakeEX.Color.FLAG_TO_RGB){
                if(arguments.length==2){
                    var n=arguments[1];
                    var r=(n>>16) & 255;
                    var g=(n>>8) & 255;
                    var b=(n) & 255;
                    return TSnakeEX.String.format("rgb({0},{1},{2})",r,g,b);
                }else{
                    var r=arguments[1];
                    var g=arguments[2];
                    var b=arguments[3];
                    return TSnakeEX.String.format("rgb({0},{1},{2})",r,g,b);
                }
            }
            if(flag & TSnakeEX.Color.FLAG_TO_HEX){
                if(arguments.length==2){
                    var n=arguments[1];
                    return "#"+TSnakeEX.String.leftFill(n.toString(16),6,"0");
                }else{
                    var r=arguments[1];
                    var g=arguments[2];
                    var b=arguments[3];
                    return "#"+TSnakeEX.String.leftFill(((r<<16)+(g<<8)+(b)).toString(16),6,"0");
                }
            }
            if(flag & TSnakeEX.Color.FLAG_TO_HSL){
                var h=arguments[1];
                var s=arguments[2];
                var l=arguments[3];
                return TSnakeEX.String.format("hsl({0},{1},{2})",h,s,l);
            }
        }
        return null;
    };
    TSnakeEX.Config={};
    TSnakeEX.Config.convert=false;
    TSnakeEX.Config.blocks=[
        {
            offset:{x:3,y:-3},
            image:"./images/block_1.png",
            break_image:"./images/break_1.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],R:[[0,0],[1,0],[1,1],[0,-2],[1,-2]]},
                    data:[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],R:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]},
                    data:[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,1,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],R:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]},
                    data:[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,-1],[0,2],[1,2]],R:[[0,0],[1,0],[1,-1],[0,2],[1,2]]},
                    data:[[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]]
                }
            ]
        },
        {
            offset:{x:3,y:-3},
            image:"./images/block_2.png",
            break_image:"./images/break_2.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],R:[[0,0],[1,0],[1,1],[0,-2],[1,-2]]},
                    data:[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],R:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]},
                    data:[[0,0,0,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],R:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]},
                    data:[[0,0,0,0],[0,0,0,0],[1,1,0,0],[0,1,1,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,-1],[0,2],[1,2]],R:[[0,0],[1,0],[1,-1],[0,2],[1,2]]},
                    data:[[0,0,0,0],[0,1,0,0],[1,1,0,0],[1,0,0,0]]
                }
            ]
        },
        {
            offset:{x:3,y:-3},
            image:"./images/block_3.png",
            break_image:"./images/break_3.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],R:[[0,0],[1,0],[1,1],[0,-2],[1,-2]]},
                    data:[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],R:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]},
                    data:[[0,0,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],R:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]},
                    data:[[0,0,0,0],[0,0,0,0],[0,1,1,0],[1,1,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,-1],[0,2],[1,2]],R:[[0,0],[1,0],[1,-1],[0,2],[1,2]]},
                    data:[[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]]
                }
            ]
        },
        {
            offset:{x:3,y:-3},
            image:"./images/block_4.png",
            break_image:"./images/break_4.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],R:[[0,0],[1,0],[1,1],[0,-2],[1,-2]]},
                    data:[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],R:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]},
                    data:[[0,0,0,0],[0,1,1,0],[0,1,0,0],[0,1,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],R:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]},
                    data:[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,-1],[0,2],[1,2]],R:[[0,0],[1,0],[1,-1],[0,2],[1,2]]},
                    data:[[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]]
                }
            ]
        },
        {
            offset:{x:3,y:-3},
            image:"./images/block_5.png",
            break_image:"./images/break_5.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],R:[[0,0],[1,0],[1,1],[0,-2],[1,-2]]},
                    data:[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],R:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]},
                    data:[[0,0,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],R:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]},
                    data:[[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[1,0],[1,-1],[0,2],[1,2]],R:[[0,0],[1,0],[1,-1],[0,2],[1,2]]},
                    data:[[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]]
                }
            ]
        },
        {
            offset:{x:3,y:-3},
            image:"./images/block_6.png",
            break_image:"./images/break_6.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0]],R:[[0,0]]},
                    data:[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0]],R:[[0,0]]},
                    data:[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0]],R:[[0,0]]},
                    data:[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0]],R:[[0,0]]},
                    data:[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]
                }
            ]
        },
        {
            offset:{x:3,y:-2},
            image:"./images/block_7.png",
            break_image:"./images/break_7.png",
            break_width:6,
            break_height:5,
            break_x:48,
            break_y:24,
            data:
            [
                {
                    wall_kick:{L:[[0,0],[1,0],[-2,0],[1,2],[-2,-1]],R:[[0,0],[2,0],[-1,0],[2,-1],[-1,2]]},
                    data:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],R:[[0,0],[1,0],[-2,0],[1,2],[-2,-1]]},
                    data:[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]]
                },
                {
                    wall_kick:{L:[[0,0],[-1,0],[2,0],[-1,-2],[2,1]],R:[[0,0],[-2,0],[1,0],[-2,1],[1,-2]]},
                    data:[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]]
                },
                {
                    wall_kick:{L:[[0,0],[2,0],[-1,0],[2,-1],[-1,2]],R:[[0,0],[-1,0],[2,0],[-1,-2],[2,1]]},
                    data:[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
                }
            ]
        }
    ];
    TSnakeEX.Config.touch_speed=16;
    TSnakeEX.Config.default_rotate="L";
    TSnakeEX.Config.fps=60;
    TSnakeEX.Config.rect={
        left:5,
        right:5,
        top:5,
        bottom:5
    };
    TSnakeEX.Config.restore=15;
    TSnakeEX.Config.background_music="./music/kalinka.mp3";
    TSnakeEX.Config.tutorials=[
        {
            left:1,
            top:1,
            radius:21,
            text:"点击这里进入设置面板<br />Click here to setting panel."
        }
    ];
    TSnakeEX.Keys={
        8:"BackSpace",
        9:"Tab",
        12:"Clear",
        13:"Enter",
        16:"Shift",
        17:"Control",
        18:"Alt",
        19:"Pause",
        20:"Caps Lock",
        27:"Escape",
        32:"Space",
        33:"Prior",
        34:"Next",
        35:"End",
        36:"Home",
        37:"Left",
        38:"Up",
        39:"Right",
        40:"Down",
        41:"Select",
        42:"Print",
        43:"Execute",
        45:"Insert",
        46:"Delete",
        47:"Help",
        48:"0",
        49:"1",
        50:"2",
        51:"3",
        52:"4",
        53:"5",
        54:"6",
        55:"7",
        56:"8",
        57:"9",
        65:"A",
        66:"B",
        67:"C",
        68:"D",
        69:"E",
        70:"F",
        71:"G",
        72:"H",
        73:"I",
        74:"J",
        75:"K",
        76:"L",
        77:"M",
        78:"N",
        79:"O",
        80:"P",
        81:"Q",
        82:"R",
        83:"S",
        84:"T",
        85:"U",
        86:"V",
        87:"W",
        88:"X",
        89:"Y",
        90:"Z",
        96:"KP 0",
        97:"KP 1",
        98:"KP 2",
        99:"KP 3",
        100:"KP 4",
        101:"KP 5",
        102:"KP 6",
        103:"KP 7",
        104:"KP 8",
        105:"KP 9",
        106:"KP Multiply",
        107:"KP Add",
        108:"KP Separator",
        109:"KP Subtract",
        110:"KP Decimal",
        111:"KP Divide",
        112:"F1",
        113:"F2",
        114:"F3",
        115:"F4",
        116:"F5",
        117:"F6",
        118:"F7",
        119:"F8",
        120:"F9",
        121:"F10",
        122:"F11",
        123:"F12",
        124:"F13",
        125:"F14",
        126:"F15",
        127:"F16",
        128:"F17",
        129:"F18",
        130:"F19",
        131:"F20",
        132:"F21",
        133:"F22",
        134:"F23",
        135:"F24",
        136:"Number Lock",
        137:"Scroll Lock",
        186:";:",
        187:"=+",
        188:",<",
        189:"-_",
        190:".>",
        191:"/?",
        192:"`~",
        219:"[{",
        220:"\\|",
        221:"]}",
        222:"'\""
    };
    TSnakeEX.Config.language={};
    TSnakeEX.Config.language.zh_cn={
        name:"CN",
        data:{
            time_format:"时间：",
            score_format:"分数：",
            lines_format:"消行数：",
            blocks_format:"方块数：",
            pps_format:"每秒方块数：",
            lpm_format:"每分消行数：",
            frames_format:"计算帧数：",
            render_frames_format:"渲染帧数：",
            key_hard_drop_label:"硬降",
            key_drop_label:"降落",
            key_move_left_label:"向左移动",
            key_move_right_label:"向右移动",
            key_rotate_left_label:"逆时针旋转",
            key_rotate_right_label:"顺时针旋转",
            key_hold_label:"方块暂存",
            key_restart_label:"重新开始",
            key_pause_label:"暂停",
            are_label:"出现延迟",
            drop_delay_label:"下落延迟",
            lock_delay_label:"锁定延迟",
            das_label:"自动重复延迟",
            arr_label:"自动重复速度",
            drop_arr_label:"下落自动重复速度",
            invisible_label:"隐形模式",
            ghost_label:"方块阴影",
            pause_on_blur_label:"失去焦点时暂停",
            save_config_label:"保存设置",
            reset_config_label:"重置设置",
            mode_marathon_label:"马拉松",
            mode_40_lines_label:"40行",
            mode_ultra_label:"Ultra",
            start_label:"开始游戏",
            info_title_label:"游戏结束"
        }
    };
    TSnakeEX.Config.language.en_us={
        name:"EN",
        data:{
            time_format:"Time: ",
            score_format:"Score: ",
            lines_format:"Lines: ",
            blocks_format:"Blocks: ",
            pps_format:"PPS: ",
            lpm_format:"LPM: ",
            frames_format:"Frames: ",
            render_frames_format:"Render Frames: ",
            key_hard_drop_label:"Key Hard Drop",
            key_drop_label:"Key Drop",
            key_move_left_label:"Key Move Left",
            key_move_right_label:"Key Move Right",
            key_rotate_left_label:"Key Rotate CCW",
            key_rotate_right_label:"Key Rotate Cw",
            key_hold_label:"Key Hold",
            key_restart_label:"Key Restart",
            key_pause_label:"Key Pause",
            are_label:"ARE",
            drop_delay_label:"Drop Delay",
            lock_delay_label:"Lock Delay",
            das_label:"DAS",
            arr_label:"ARR",
            drop_arr_label:"Drop ARR",
            invisible_label:"Invisible",
            ghost_label:"Ghost",
            pause_on_blur_label:"Pause On Blur",
            save_config_label:"Save Config",
            reset_config_label:"Reset Config",
            mode_marathon_label:"Marathon",
            mode_40_lines_label:"40 Lines",
            mode_ultra_label:"Ultra",
            start_label:"Start Game",
            info_title_label:"Game Over"
        }
    };
    TSnakeEX.test=function(){
        var e=document.createElement("canvas");
        var t=window.localStorage && e.getContext && e.getContext("2d");
        TSnakeEX.test=function(){
            return t;
        };
        return t;
    };
    window.TSnakeEX=TSnakeEX;
})();