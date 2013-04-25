(function(){
    "use strict";
    TSnakeEX.Single={
        init:function(){
            if(!TSnakeEX.Config.convert){
                TSnakeEX.each(TSnakeEX.Config.blocks,function(){
                    if(this.color){
                        this.color=TSnakeEX.Color.convert(TSnakeEX.Color.FLAG_TO_STR | TSnakeEX.Color.FLAG_TO_HEX,this.color);
                    }
                });
                var i=[],ib=[];
                TSnakeEX.each(TSnakeEX.Config.blocks,function(k,v){
                    i[k]=v.image;
                    ib[k]=v.break_image;
                });
                this._load_images(i,function(ii){
                    TSnakeEX.each(ii,function(k,v){
                        TSnakeEX.Config.blocks[k].image=v;
                    });
                    this._load_images(ib,function(ibi){
                        TSnakeEX.each(ibi,function(k,v){
                            var t=TSnakeEX.Config.blocks[k];
                            t.break_image=v;
                            t.break_image_width=v.width/t.break_width;
                            t.break_image_height=v.height/t.break_height;
                        });
                        TSnakeEX.Config.convert=true;
                        this._init_callback();
                    });
                });
            }else{
                this._init_callback();
            }
        },
        _init_callback:function(){
            var self=this;
            this._config=TSnakeEX.Config;
            this._local_config={};
            this._local_config.keys={};
            var language=localStorage.getItem("language");
            this._language=(language && (language in this._config.language))?language:"zh_cn";
            this._language_config=this._config.language[this._language];
            this._language_data=this._language_config.data;
            this._game_div=document.getElementsByClassName("game")[0];
            this._icons_div=document.getElementsByClassName("icons")[0];
            var icons=this._icons_div.getElementsByClassName("icon");
            this._setting_icon=icons[0];
            this._about_icon=icons[1];
            this._buffer_canvas=document.getElementsByClassName("buffer")[0];
            this._buffer_context=this._buffer_canvas.getContext("2d");
            this._hold_canvas=document.getElementsByClassName("hold")[0];
            this._hold_context=this._hold_canvas.getContext("2d");
            this._next_canvas=document.getElementsByClassName("next")[0];
            this._next_context=this._next_canvas.getContext("2d");
            this._main_canvas=document.getElementsByClassName("main")[0];
            this._main_context=this._main_canvas.getContext("2d");
            this._tip_div=document.getElementsByClassName("tip")[0];
            this._timer_div=document.getElementsByClassName("timer")[0];
            this._setting_panel=document.getElementsByClassName("setting")[0];
            this._setting_panel_visible=false;
            this._keys_array={
                "hard_drop":[this._language_data.key_hard_drop_label,38],
                "drop":[this._language_data.key_drop_label,40],
                "move_left":[this._language_data.key_move_left_label,37],
                "move_right":[this._language_data.key_move_right_label,39],
                "rotate_left":[this._language_data.key_rotate_left_label,90],
                "rotate_right":[this._language_data.key_rotate_right_label,88],
                "hold":[this._language_data.key_hold_label,32],
                "restart":[this._language_data.key_restart_label,123],
                "pause":[this._language_data.key_pause_label,27]
            };
            TSnakeEX.each(this._keys_array,function(k,v){
                self["_setting_panel_key_"+k+"_label"]=document.createElement("div");
                self["_setting_panel_key_"+k+"_label"].innerHTML=v[0];
                self["_setting_panel_key_"+k+"_p"]=document.createElement("p");
                self["_setting_panel_key_"+k]=document.createElement("input");
                self["_setting_panel_key_"+k].type="text";
                self._setting_panel.appendChild(self["_setting_panel_key_"+k+"_label"]);
                self["_setting_panel_key_"+k+"_p"].appendChild(self["_setting_panel_key_"+k]);
                self._setting_panel.appendChild(self["_setting_panel_key_"+k+"_p"]);
                self["_setting_panel_key_"+k].onkeydown=function(event){
                    event=event || window.event;
                    this.value=event.which+"/"+(TSnakeEX.Keys[event.which] || "Unknown");
                    if(event.preventDefault){
                        event.preventDefault();
                    }
                    return false;
                };
            });
            this._setting_panel_are_label=document.createElement("p");
            this._setting_panel_are_label.innerHTML=this._language_data.are_label;
            this._setting_panel_are_p=document.createElement("p");
            this._setting_panel_are=document.createElement("input");
            this._setting_panel_are.type="text";
            this._setting_panel.appendChild(this._setting_panel_are_label);
            this._setting_panel_are_p.appendChild(this._setting_panel_are);
            this._setting_panel.appendChild(this._setting_panel_are_p);
            this._setting_panel_drop_delay_label=document.createElement("p");
            this._setting_panel_drop_delay_label.innerHTML=this._language_data.drop_delay_label;
            this._setting_panel_drop_delay_p=document.createElement("p");
            this._setting_panel_drop_delay=document.createElement("input");
            this._setting_panel_drop_delay.type="text";
            this._setting_panel.appendChild(this._setting_panel_drop_delay_label);
            this._setting_panel_drop_delay_p.appendChild(this._setting_panel_drop_delay);
            this._setting_panel.appendChild(this._setting_panel_drop_delay_p);
            this._setting_panel_lock_delay_label=document.createElement("p");
            this._setting_panel_lock_delay_label.innerHTML=this._language_data.lock_delay_label;
            this._setting_panel_lock_delay_p=document.createElement("p");
            this._setting_panel_lock_delay=document.createElement("input");
            this._setting_panel_lock_delay.type="text";
            this._setting_panel.appendChild(this._setting_panel_lock_delay_label);
            this._setting_panel_lock_delay_p.appendChild(this._setting_panel_lock_delay);
            this._setting_panel.appendChild(this._setting_panel_lock_delay_p);
            this._setting_panel_das_label=document.createElement("p");
            this._setting_panel_das_label.innerHTML=this._language_data.das_label;
            this._setting_panel_das_p=document.createElement("p");
            this._setting_panel_das=document.createElement("input");
            this._setting_panel_das.type="text";
            this._setting_panel.appendChild(this._setting_panel_das_label);
            this._setting_panel_das_p.appendChild(this._setting_panel_das);
            this._setting_panel.appendChild(this._setting_panel_das_p);
            this._setting_panel_arr_label=document.createElement("p");
            this._setting_panel_arr_label.innerHTML=this._language_data.arr_label;
            this._setting_panel_arr_p=document.createElement("p");
            this._setting_panel_arr=document.createElement("input");
            this._setting_panel_arr.type="text";
            this._setting_panel.appendChild(this._setting_panel_arr_label);
            this._setting_panel_arr_p.appendChild(this._setting_panel_arr);
            this._setting_panel.appendChild(this._setting_panel_arr_p);
            this._setting_panel_drop_arr_label=document.createElement("p");
            this._setting_panel_drop_arr_label.innerHTML=this._language_data.drop_arr_label;
            this._setting_panel_drop_arr_p=document.createElement("p");
            this._setting_panel_drop_arr=document.createElement("input");
            this._setting_panel_drop_arr.type="text";
            this._setting_panel.appendChild(this._setting_panel_drop_arr_label);
            this._setting_panel_drop_arr_p.appendChild(this._setting_panel_drop_arr);
            this._setting_panel.appendChild(this._setting_panel_drop_arr_p);
            this._setting_panel_invisible_label=document.createElement("p");
            this._setting_panel_invisible_label.innerHTML=this._language_data.invisible_label;
            this._setting_panel_invisible_p=document.createElement("p");
            this._setting_panel_invisible=document.createElement("input");
            this._setting_panel_invisible.type="checkbox";
            this._setting_panel.appendChild(this._setting_panel_invisible_label);
            this._setting_panel_invisible_p.appendChild(this._setting_panel_invisible);
            this._setting_panel.appendChild(this._setting_panel_invisible_p);
            this._setting_panel_ghost_label=document.createElement("p");
            this._setting_panel_ghost_label.innerHTML=this._language_data.ghost_label;
            this._setting_panel_ghost_p=document.createElement("p");
            this._setting_panel_ghost=document.createElement("input");
            this._setting_panel_ghost.type="checkbox";
            this._setting_panel.appendChild(this._setting_panel_ghost_label);
            this._setting_panel_ghost_p.appendChild(this._setting_panel_ghost);
            this._setting_panel.appendChild(this._setting_panel_ghost_p);
            this._setting_panel_pause_on_blur_label=document.createElement("p");
            this._setting_panel_pause_on_blur_label.innerHTML=this._language_data.pause_on_blur_label;
            this._setting_panel_pause_on_blur_p=document.createElement("p");
            this._setting_panel_pause_on_blur=document.createElement("input");
            this._setting_panel_pause_on_blur.type="checkbox";
            this._setting_panel.appendChild(this._setting_panel_pause_on_blur_label);
            this._setting_panel_pause_on_blur_p.appendChild(this._setting_panel_pause_on_blur);
            this._setting_panel.appendChild(this._setting_panel_pause_on_blur_p);
            this._setting_panel_save_div=document.createElement("p");
            this._setting_panel.appendChild(this._setting_panel_save_div);
            this._setting_panel_save=document.createElement("button");
            this._setting_panel_save.innerHTML=this._language_data.save_config_label;
            this._setting_panel_save_div.appendChild(this._setting_panel_save);
            this._setting_panel_reset_div=document.createElement("p");
            this._setting_panel.appendChild(this._setting_panel_reset_div);
            this._setting_panel_reset=document.createElement("button");
            this._setting_panel_reset.innerHTML=this._language_data.reset_config_label;
            this._setting_panel_reset_div.appendChild(this._setting_panel_reset);
            this._start_div=document.getElementsByClassName("start")[0];
            this._mode_array={
                "marathon":[this._language_data.mode_marathon_label,function(){
                    return false;
                },function(){
                    return 1;
                },function(state){
                    var duration=0;
                    TSnakeEX.each(state.range,function(){
                        duration+=this.end-this.start;
                    });
                    return [
                        "<p>"+self._language_data.time_format+self._format_time(duration)+"</p>",
                        "<p>"+self._language_data.score_format+state.score+"</p>",
                        "<p>"+self._language_data.lines_format+state.lines+"</p>",
                        "<p>"+self._language_data.blocks_format+state.blocks+"</p>"
                    ].join("");
                }],
                "40_lines":[this._language_data.mode_40_lines_label,function(state){
                    return state.lines>=40;
                },function(state){
                    return state.lines/40;
                },function(state){
                    var duration=0;
                    TSnakeEX.each(state.range,function(){
                        duration+=this.end-this.start;
                    });
                    return [
                        "<h1 style='text-align: center;'>"+(40-state.lines)+"</h1>",
                        "<p>"+self._language_data.time_format+self._format_time(duration)+"</p>",
                        "<p>"+self._language_data.score_format+state.score+"</p>",
                        "<p>"+self._language_data.lines_format+state.lines+"</p>",
                        "<p>"+self._language_data.blocks_format+state.blocks+"</p>"
                    ].join("");
                }],
                "ultra":[this._language_data.mode_ultra_label,function(state){
                    var duration=0;
                    TSnakeEX.each(state.range,function(){
                        duration+=this.end-this.start;
                    });
                    if(duration>=120000){
                        return true;
                    }
                    return false;
                },function(state){
                    var duration=0;
                    TSnakeEX.each(state.range,function(){
                        duration+=this.end-this.start;
                    });
                    return duration/1000/120;
                },function(state){
                    var duration=0;
                    TSnakeEX.each(state.range,function(){
                        duration+=this.end-this.start;
                    });
                    return [
                        "<h1 style='text-align: center;'>"+self._format_time(120000-duration,true)+"</h1>",
                        "<p>"+self._language_data.time_format+self._format_time(duration)+"</p>",
                        "<p>"+self._language_data.score_format+state.score+"</p>",
                        "<p>"+self._language_data.lines_format+state.lines+"</p>",
                        "<p>"+self._language_data.blocks_format+state.blocks+"</p>"
                    ].join("");
                }]
            };
            this._start_mode_p=document.createElement("p");
            this._start_mode=document.createElement("select");
            this._start_div.appendChild(this._start_mode_p);
            this._start_mode_p.appendChild(this._start_mode);
            TSnakeEX.each(this._mode_array,function(k,v){
                var option=document.createElement("option");
                option.value=k;
                option.text=v[0];
                self._start_mode.add(option);
            });
            this._start_button_p=document.createElement("p");
            this._start_button=document.createElement("button");
            this._start_button.innerHTML=this._language_data.start_label;
            this._start_div.appendChild(this._start_button_p);
            this._start_button_p.appendChild(this._start_button);
            this._progress_inner=document.getElementsByClassName("progress-inner")[0];
            this._console=document.getElementsByClassName("console")[0];
            this._info_div=document.getElementsByClassName("info")[0];
            this._info_title_div=document.getElementsByClassName("info-title")[0];
            this._info_title_div.innerHTML=this._language_data.info_title_label;
            this._info_text_div=document.getElementsByClassName("info-text")[0];
            this._info_button=document.getElementsByClassName("info-button")[0];
            this._about=document.getElementsByClassName("about")[0];
            this._about_visible=false;
            this._bgm=document.getElementsByClassName("audio")[0];
            this._bgm.src=TSnakeEX.Config.background_music;
            this._bgm_div=document.getElementsByClassName("volume")[0];
            var bgm_icons=this._bgm_div.getElementsByClassName("icon");
            this._bgm_volume=bgm_icons[0];
            this._bgm_mute=bgm_icons[1];
            var playing=localStorage.getItem("playing");
            this._bgm_playing=(playing && !isNaN(playing)?parseInt(playing):1)?true:false;
            if(this._bgm_playing){
                this._bgm.play();
                this._bgm_mute.style.display="none";
            }else{
                this._bgm_volume.style.display="none";
            }
            this._loading_div=document.getElementsByClassName("loading")[0];
            this._loading_div.style.display="none";
            this._mask_div=document.getElementsByClassName("mask")[0];
            this._mask_inner_div=document.getElementsByClassName("mask-inner")[0];
            this._mask_tip_div=document.getElementsByClassName("mask-tip")[0];
            this._language_div=document.getElementsByClassName("language")[0];
            TSnakeEX.each(this._config.language,function(k,v){
                var option=document.createElement("div");
                option.innerHTML=v.name;
                if(k==self._language){
                    option.className="language-option on";
                }else{
                    option.className="language-option";
                    self._add_event_listener(option,"click",function(){
                        localStorage.setItem("language",k);
                        window.location.reload();
                    });
                }
                self._language_div.appendChild(option);
            });
            this._keys=
            [
                {
                    keycode:function(){
                        return self._local_config.keys.hard_drop
                    },
                    pause:false,
                    das:function(){
                        return -1;
                    },
                    arr:function(){
                        return -1;
                    },
                    action:function(){
                        if(self._complete==1 || self._complete==2){
                            self._hard_drop();
                            self._this_block.visible=false;
                            self._mask_block.type=self._this_block.type;
                            self._mask_block.spin=self._this_block.spin;
                            self._mask_block.x=self._this_block.x;
                            self._mask_block.y=self._this_block.y;
                            self._mask_block.visible=1;
                            self._clear_lines();
                            if(self._mask_lines.length){
                                self._complete=3;
                            }else{
                                self._drop_lines();
                                self._complete=0;
                            }
                            self._temp1=0;
                            self._temp2=0;
                            return true;
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.drop
                    },
                    pause:false,
                    das:function(){
                        return self._local_config.drop_arr;
                    },
                    arr:function(){
                        return self._local_config.drop_arr;
                    },
                    action:function(){
                        if(self._complete==1 || self._complete==2){
                            if(self._can_drop()){
                                self._drop();
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.move_left
                    },
                    pause:false,
                    das:function(){
                        return self._local_config.das;
                    },
                    arr:function(){
                        return self._local_config.arr;
                    },
                    action:function(){
                        if(self._complete==0 || self._complete==1 || self._complete==2){
                            if(self._can_move_left()){
                                self._move_left();
                                if(self._timer_restore<=self._config.restore){
                                    self._temp2=0;
                                    self._timer_restore++;
                                }
                                if(self._local_config.drop_delay<=0){
                                    while(self._can_drop()){
                                        self._drop();
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.move_right
                    },
                    pause:false,
                    das:function(){
                        return self._local_config.das;
                    },
                    arr:function(){
                        return self._local_config.arr;
                    },
                    action:function(){
                        if(self._complete==0 || self._complete==1 || self._complete==2){
                            if(self._can_move_right()){
                                self._move_right();
                                if(self._timer_restore<=self._config.restore){
                                    self._temp2=0;
                                    self._timer_restore++;
                                }
                                if(self._local_config.drop_delay<=0){
                                    while(self._can_drop()){
                                        self._drop();
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.rotate_left
                    },
                    pause:false,
                    das:function(){
                        return -1;
                    },
                    arr:function(){
                        return -1;
                    },
                    action:function(){
                        if(self._complete==0 || self._complete==1 || self._complete==2){
                            if(self._can_rotate_left()){
                                self._rotate_left();
                                if(self._timer_restore<=self._config.restore){
                                    self._temp2=0;
                                    self._timer_restore++;
                                }
                                if(self._local_config.drop_delay<=0){
                                    while(self._can_drop()){
                                        self._drop();
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.rotate_right
                    },
                    pause:false,
                    das:function(){
                        return -1;
                    },
                    arr:function(){
                        return -1;
                    },
                    action:function(){
                        if(self._complete==0 || self._complete==1 || self._complete==2){
                            if(self._can_rotate_right()){
                                self._rotate_right();
                                if(self._timer_restore<=self._config.restore){
                                    self._temp2=0;
                                    self._timer_restore++;
                                }
                                if(self._local_config.drop_delay<=0){
                                    while(self._can_drop()){
                                        self._drop();
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.hold
                    },
                    pause:false,
                    das:function(){
                        return -1;
                    },
                    arr:function(){
                        return -1;
                    },
                    action:function(){
                        if(self._complete==0){
                            if(self._can_hold()){
                                self._hold();
                                return true;
                            }
                        }
                        if(self._complete==1 || self._complete==2){
                            if(self._can_hold()){
                                self._hold();
                                self._complete=0;
                                if(self._local_config.are>0){
                                    self._temp0=self._local_config.are;
                                }else{
                                    self._temp0=1;
                                }
                                self._temp1=0;
                                if(self._timer_restore<=self._config.restore){
                                    self._temp2=0;
                                    self._timer_restore++;
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.restart
                    },
                    pause:false,
                    das:function(){
                        return -1;
                    },
                    arr:function(){
                        return -1;
                    },
                    action:function(){
                        self._complete=4;
                        self._pause=false;
                        return true;
                    }
                },
                {
                    keycode:function(){
                        return self._local_config.keys.pause
                    },
                    pause:true,
                    das:function(){
                        return -1;
                    },
                    arr:function(){
                        return -1;
                    },
                    action:function(){
                        self._pause=!self._pause;
                        return true;
                    }
                }
            ];
            this._add_event_listener(window,"click",function(){
                if(self._about_visible){
                    self._about_visible=false;
                    self._about.style.display="none";
                }
            });
            this._add_event_listener(this._game_div,"keydown",function(event){
                if(self._game_state){
                    if(!self._setting_panel_visible){
                        event=event || window.event;
                        TSnakeEX.each(self._keys,function(){
                            if(this.keycode()==event.which){
                                if(!this.isdown){
                                    this.isdown=true;
                                    this.start=new Date().getTime();
                                }
                                throw new TSnakeEX.Break();
                            }
                        });
                        if(event.preventDefault){
                            event.preventDefault();
                        }
                        return false;
                    }
                }
                return true;
            });
            this._add_event_listener(this._game_div,"keyup",function(event){
                if(self._game_state){
                    if(!self._setting_panel_visible){
                        event=event || window.event;
                        TSnakeEX.each(self._keys,function(){
                            if(this.keycode()==event.which){
                                this.isdown=false;
                                this.count=-this.das();
                                throw new TSnakeEX.Break();
                            }
                        });
                        if(event.preventDefault){
                            event.preventDefault();
                        }
                        return false;
                    }
                }
                return true;
            });
            this._add_event_listener(this._game_div,"focus",function(){
                self._tip_div.style.display="none";
                if(self._game_state){
                    if(self._local_config.pause_on_blur && !self._setting_panel_visible){
                        self._resume_game();
                    }
                }
            });
            this._add_event_listener(this._game_div,"blur",function(){
                self._tip_div.style.display="";
                if(self._game_state){
                    if(self._local_config.pause_on_blur && !self._setting_panel_visible){
                        self._pause_game();
                    }
                }
            });
            this._add_event_listener(this._game_div,"click",function(){
                this.focus();
            });
            this._add_event_listener(this._start_div,"click",function(e){
                if(e.stopPropagation){
                    e.stopPropagation();
                }else{
                    e.cancelBubble=true;
                }
            });
            this._add_event_listener(this._setting_panel,"click",function(e){
                if(e.stopPropagation){
                    e.stopPropagation();
                }else{
                    e.cancelBubble=true;
                }
            });
            this._add_event_listener(this._setting_icon,"click",function(){
                if(self._setting_panel_visible){
                    self._setting_panel_visible=false;
                    self._setting_panel.style.display="none";
                    if(self._game_state){
                        self._resume_game();
                    }
                }else{
                    self._setting_panel_visible=true;
                    self._setting_panel.style.display="";
                    self._load_config();
                    if(self._game_state){
                        self._pause_game();
                    }
                }
            });
            this._add_event_listener(this._setting_panel_save,"click",function(){
                self._setting_panel_visible=false;
                self._setting_panel.style.display="none";
                self._save_config();
                self._load_config();
                if(self._game_state){
                    self._resume_game();
                }
            });
            this._add_event_listener(this._setting_panel_reset,"click",function(){
                self._setting_panel_visible=false;
                self._setting_panel.style.display="none";
                self._remove_config();
                self._load_config();
                if(self._game_state){
                    self._resume_game();
                }
            });
            this._add_event_listener(this._info_button,"click",function(){
                self._info_div.style.display="none";
                self._stop_game();
            });
            this._add_event_listener(this._about_icon,"click",function(e){
                if(!self._about_visible){
                    self._about_visible=true;
                    self._about.style.display="";
                    if(e.stopPropagation){
                        e.stopPropagation();
                    }else{
                        e.cancelBubble=true;
                    }
                }
            });
            this._add_event_listener(this._about,"click",function(e){
                if(e.stopPropagation){
                    e.stopPropagation();
                }else{
                    e.cancelBubble=true;
                }
            });
            this._add_event_listener(this._start_button,"click",function(){
                var mode=self._start_mode.options[self._start_mode.selectedIndex].value;
                if(!self._mode_array[mode]){
                    mode="marathon";
                }
                self._local_config.check_game_over=self._mode_array[mode][1];
                self._local_config.update_progress=self._mode_array[mode][2];
                self._local_config.update_console=self._mode_array[mode][3];
                self._start_game();
            });
            this._add_event_listener(this._bgm_div,"click",function(){
                if(self._bgm_playing){
                    self._bgm_playing=false;
                    self._bgm_volume.style.display="none";
                    self._bgm_mute.style.display="";
                    self._bgm.pause();
                    localStorage.setItem("playing",0);
                }else{
                    self._bgm_playing=true;
                    self._bgm_volume.style.display="";
                    self._bgm_mute.style.display="none";
                    self._bgm.play();
                    localStorage.setItem("playing",1);
                }
            });
            this._load_config();
            this._timer_handle=-1;
            this._game_state=0;
            if(!localStorage.getItem("tutorials")){
                if(this._config.tutorials.length){
                    var index=0;
                    this._mask_div.style.display="";
                    this._load_tutorials(0);
                    this._add_event_listener(this._mask_div,"click",function(){
                        index++;
                        if(index>=self._config.tutorials.length){
                            self._mask_div.style.display="none";
                            localStorage.setItem("tutorials",1);
                            return;
                        }
                        self._load_tutorials(index);
                    });
                }
            }
        },
        _load_tutorials:function(index){
            this._mask_inner_div.style.left=this._config.tutorials[index].left+"px";
            this._mask_inner_div.style.top=this._config.tutorials[index].top+"px";
            this._mask_inner_div.style.width=this._config.tutorials[index].radius*2+"px";
            this._mask_inner_div.style.height=this._config.tutorials[index].radius*2+"px";
            this._mask_inner_div.style.borderRadius=(this._config.tutorials[index].radius+1000)+"px";
            this._mask_tip_div.innerHTML=this._config.tutorials[index].text;
        },
        _load_images:function(array,callback){
            var self=this;
            var a=0;
            TSnakeEX.each(array,function(){
                a++;
            });
            var r={};
            if(a==0){
                callback.call(this,r);
            }
            var c=0;
            TSnakeEX.each(array,function(k,v){
                r[k]=new Image();
                r[k].src=v;
                r[k].onload=function(){
                    c++;
                    if(a==c){
                        callback.call(self,r);
                    }
                };
            });
        },
        _add_event_listener:window.addEventListener?function(dom,type,handler){
            dom.addEventListener(type,handler);
        }:function(dom,type,handler){
            dom.attachEvent("on"+type,handler);
        },
        _format_time:function(time,no_ms){
            var ms,t,s,m,h;
            ms=time%1000;
            t=(time-ms)/1000;
            s=t%60;
            t=(t-s)/60;
            m=t%60;
            h=(t-m)/60;
            var str_ms=no_ms?"":("."+TSnakeEX.String.rightFill(Math.floor(ms/10).toString(),2,"0"));
            if(h){
                return h.toString()+":"+TSnakeEX.String.leftFill(m.toString(),2,"0")+":"+TSnakeEX.String.leftFill(s.toString(),2,"0")+str_ms;
            }else if(m){
                return m.toString()+":"+TSnakeEX.String.leftFill(s.toString(),2,"0")+str_ms;
            }else{
                return s.toString()+str_ms;
            }
        },
        _game_over:function(state){
            var duration=0;
            TSnakeEX.each(state.range,function(){
                duration+=this.end-this.start;
            });
            return [
                this._language_data.time_format+this._format_time(duration),
                this._language_data.score_format+state.score,
                this._language_data.lines_format+state.lines,
                this._language_data.blocks_format+state.blocks,
                this._language_data.pps_format+(state.blocks/duration*1000).toFixed(5),
                this._language_data.lpm_format+(state.lines/duration*1000*60).toFixed(5),
                this._language_data.frames_format+state.frames,
                this._language_data.render_frames_format+state.render_frames
            ];
        },
        _remove_config:function(){
            TSnakeEX.each(this._keys_array,function(k){
                window.localStorage.removeItem("key_"+k);
            });
            window.localStorage.removeItem("are");
            window.localStorage.removeItem("drop_delay");
            window.localStorage.removeItem("lock_delay");
            window.localStorage.removeItem("das");
            window.localStorage.removeItem("arr");
            window.localStorage.removeItem("drop_arr");
            window.localStorage.removeItem("invisible");
            window.localStorage.removeItem("ghost");
            window.localStorage.removeItem("pause_on_blur");
        },
        _load_config:function(){
            var self=this;
            TSnakeEX.each(this._keys_array,function(k,v){
                var value=window.localStorage.getItem("key_"+k);
                self._local_config.keys[k]=value && !isNaN(value)?parseInt(value,10):v[1];
                self["_setting_panel_key_"+k].value=self._local_config.keys[k]+"/"+(TSnakeEX.Keys[self._local_config.keys[k]] || "Unknown");
            });
            var are=window.localStorage.getItem("are");
            var drop_delay=window.localStorage.getItem("drop_delay");
            var lock_delay=window.localStorage.getItem("lock_delay");
            var das=window.localStorage.getItem("das");
            var arr=window.localStorage.getItem("arr");
            var drop_arr=window.localStorage.getItem("drop_arr");
            var invisible=window.localStorage.getItem("invisible");
            var ghost=window.localStorage.getItem("ghost");
            var pause_on_blur=window.localStorage.getItem("pause_on_blur");
            this._setting_panel_are.value=this._local_config.are=are && !isNaN(are)?parseInt(are,10):0;
            this._setting_panel_drop_delay.value=this._local_config.drop_delay=drop_delay && !isNaN(drop_delay)?parseInt(drop_delay,10):60;
            this._setting_panel_lock_delay.value=this._local_config.lock_delay=lock_delay && !isNaN(lock_delay)?parseInt(lock_delay,10):60;
            this._setting_panel_das.value=this._local_config.das=das && !isNaN(das)?parseInt(das,10):10;
            this._setting_panel_arr.value=this._local_config.arr=arr && !isNaN(arr)?parseInt(arr,10):1;
            this._setting_panel_drop_arr.value=this._local_config.drop_arr=drop_arr && !isNaN(drop_arr)?parseInt(drop_arr,10):1;
            this._local_config.invisible=(invisible===undefined || invisible===null?false:(invisible && !isNaN(invisible)?(parseInt(invisible,10)?true:false):false));
            this._setting_panel_invisible.checked=this._local_config.invisible?"checked":"";
            this._local_config.ghost=(ghost===undefined || ghost===null?true:(ghost && !isNaN(ghost)?(parseInt(ghost,10)?true:false):true));
            this._setting_panel_ghost.checked=this._local_config.ghost?"checked":"";
            this._local_config.pause_on_blur=(pause_on_blur===undefined || pause_on_blur===null?true:(pause_on_blur && !isNaN(pause_on_blur)?(parseInt(pause_on_blur,10)?true:false):true));
            this._setting_panel_pause_on_blur.checked=this._local_config.pause_on_blur;
        },
        _save_config:function(){
            var self=this;
            TSnakeEX.each(this._keys_array,function(k,v){
                var value=self["_setting_panel_key_"+k].value.split("/")[0];
                window.localStorage.setItem("key_"+k,value && !isNaN(value)?parseInt(value,10):v[1]);
            });
            var are=this._setting_panel_are.value;
            var drop_delay=this._setting_panel_drop_delay.value;
            var lock_delay=this._setting_panel_lock_delay.value;
            var das=this._setting_panel_das.value;
            var arr=this._setting_panel_arr.value;
            var drop_arr=this._setting_panel_drop_arr.value;
            var invisible=this._setting_panel_invisible.checked;
            var ghost=this._setting_panel_ghost.checked;
            var pause_on_blur=this._setting_panel_pause_on_blur.checked;
            window.localStorage.setItem("are",are && !isNaN(are)?parseInt(are,10):0);
            window.localStorage.setItem("drop_delay",drop_delay && !isNaN(drop_delay)?parseInt(drop_delay,10):60);
            window.localStorage.setItem("lock_delay",lock_delay && !isNaN(lock_delay)?parseInt(lock_delay,10):60);
            window.localStorage.setItem("das",das && !isNaN(das)?parseInt(das,10):10);
            window.localStorage.setItem("arr",arr && !isNaN(arr)?parseInt(arr,10):1);
            window.localStorage.setItem("drop_arr",drop_arr && !isNaN(drop_arr)?parseInt(drop_arr,10):1);
            window.localStorage.setItem("invisible",invisible?1:0);
            window.localStorage.setItem("ghost",ghost?1:0);
            window.localStorage.setItem("pause_on_blur",pause_on_blur?1:0);
        },
        _key_isdown:function(){
            if(this.pause || !self._pause){
                if(this.isdown){
                    if(this.das()==0 && this.arr()==0){
                        return 3;
                    }else{
                        if(this.count==-this.das()){
                            return 1;
                        }
                        if(this.das()!=-1 && this.count>=0){
                            if(this.arr()==0){
                                return 3;
                            }else if(this.count==0){
                                return 2;
                            }
                        }
                        return -1;
                    }
                }
            }
            return 0;
        },
        _init:function(){
            var self=this;
            this._history=[-1,-1,-1,-1];
            this._this_block={x:0,y:0,type:0,spin:0,visible:false};
            this._next_block=this._history_4();
            this._hold_block=-1;
            this._mask_block={x:0,y:0,type:0,spin:0,visible:0};
            this._mask_lines=[];
            this._has_hold=false;
            this._need_next=true;
            this._complete=-1;
            this._timer_temp=0;
            this._timer_old=-1;
            this._temp0=0;
            this._temp1=0;
            this._temp2=0;
            this._temp3=0;
            this._pause=false;
            this._main=[];
            for(var i=0;i<this._config.rect.top+20+this._config.rect.bottom;i++){
                this._main[i]=[];
                for(var j=0;j<this._config.rect.left+10+this._config.rect.right;j++){
                    this._main[i][j]=-1;
                }
            }
            this._pause_before=this._pause;
            this._state={
                time:new Date().getTime(),
                range:[],
                frames:0,
                render_frames:0,
                score:0,
                lines:0,
                blocks:0
            };
            this._time=new Date().getTime();
            TSnakeEX.each(this._keys,function(){
                this.isdown=false;
                this.count=-this.das();
                this.check_isdown=self._key_isdown;
            });
            this._touch={
                isdown:false,
                start:{
                    mouse:{
                        x:0,
                        y:0
                    },
                    x:0,
                    y:0,
                    time:0
                },
                before:{
                    mouse:{
                        x:0,
                        y:0
                    },
                    x:0,
                    y:0,
                    time:0
                },
                now:{
                    mouse:{
                        x:0,
                        y:0
                    },
                    x:0,
                    y:0,
                    time:0
                }
            };
            this._console_temp=-1;
            this._has_back_to_back=false;
            this._combo_count=-1;
            this._break_blocks=[];
        },
        _timer:function(){
            var now=new Date().getTime();
            if(now-this._time>=1000/this._config.fps){
                var times=Math.floor((now-this._time)/(1000/this._config.fps));
                this._game(times);
                this._time+=times*(1000/this._config.fps);
            }
            var self=this;
            if(this._game_state==1){
                this._timer_handle=setTimeout(function(){self._timer.call(self);},0);
            }
        },
        _start_game:function(){
            if(this._game_state==0){
                this._game_state=1;
                this._init();
                this._timer();
                this._start_div.style.display="none";
            }
        },
        _stop_game:function(){
            if(this._game_state==1){
                this._game_state=0;
                clearTimeout(this._timer_handle);
                this._timer_handle=-1;
                this._start_div.style.display="";
            }
        },
        _pause_game:function(){
            this._pause=true;
        },
        _resume_game:function(){
            this._pause=false;
        },
        _game:function(times){
            var self=this;
            if(this._complete!=5){
                for(var i=0;i<times;i++){
                    if(this._local_config.check_game_over(this._state)){
                        this._complete=4;
                    }
                    if(this._pause){
                        if(this._pause_before){
                        }else{
                            this._state.range[this._state.range.length-1] && (this._state.range[this._state.range.length-1].end=new Date().getTime());
                        }
                    }else{
                        if(this._pause_before){
                            if(this._complete!=-1){
                                this._state.range.push({
                                    start:new Date().getTime(),
                                    end:new Date().getTime()
                                });
                            }
                        }else{
                            this._state.range[this._state.range.length-1] && (this._state.range[this._state.range.length-1].end=new Date().getTime());
                        }
                    }
                    this._pause_before=this._pause;
                    var r=[];
                    TSnakeEX.each(this._break_blocks,function(k,v){
                        v.count+=v.speed;
                        var t=self._config.blocks[v.type];
                        if(Math.round(v.count)>=t.break_width*t.break_height){
                            r.push(k);
                        }
                    });
                    TSnakeEX.each(r,function(){
                        self._break_blocks.splice(this,1);
                    });
                    if(!this._pause){
                        if(this._mask_block.visible!=0){
                            this._mask_block.visible++;
                            if(this._mask_block.visible>2){
                                this._mask_block.visible=0;
                            }
                        }
                        while(true){
                            var flag=true;
                            switch(this._complete){
                                case -1:
                                    this._timer_temp++;
                                    if(this._timer_temp==1){
                                        this._timer_div.style.display="";
                                    }
                                    var count=Math.floor(this._timer_temp/this._config.fps);
                                    if(count!=this._timer_old){
                                        this._timer_div.innerHTML=3-count;
                                    }
                                    if(count>=3){
                                        this._timer_div.style.display="none";
                                        this._timer_temp=0;
                                        this._timer_old=-1;
                                        this._complete=0;
                                        this._state.range.push({
                                            start:new Date().getTime(),
                                            end:new Date().getTime()
                                        });
                                    }
                                    break;
                                case 0:
                                    this._temp0++;
                                    if(this._temp0==1){
                                        this._this_block.type=this._next_block;
                                        this._this_block.spin=0;
                                        this._this_block.x=this._config.blocks[this._this_block.type].offset.x;
                                        this._this_block.y=this._config.blocks[this._this_block.type].offset.y;
                                        this._this_block.visible=false;
                                        this._has_hold=false;
                                        this._need_next=true;
                                        this._action_before="";
                                        this._has_wall_kick=false;
                                        this._has_spin=false;
                                        this._timer_restore=0;
                                    }
                                    if(this._local_config.are>0){
                                        if(this._temp0>=this._local_config.are){
                                            this._this_block.visible=true;
                                            if(this._need_next){
                                                this._next_block=this._history_4();
                                            }
                                            this._complete=1;
                                            this._temp0=0;
                                            if(this._dead()){
                                                this._complete=4;
                                                flag=false;
                                            }
                                        }
                                    }else{
                                        this._this_block.visible=true;
                                        if(this._need_next){
                                            this._next_block=this._history_4();
                                        }
                                        this._complete=1;
                                        this._temp0=0;
                                        if(this._dead()){
                                            this._complete=4;
                                            flag=false;
                                        }
                                        flag=false;
                                    }
                                    break;
                                case 1:
                                    this._temp1++;
                                    if(!this._can_drop()){
                                        this._complete=2;
                                        if(this._local_config.lock_delay<=0){
                                            flag=false;
                                        }
                                    }
                                    if(this._local_config.drop_delay>0){
                                        if(this._temp1>=this._local_config.drop_delay){
                                            if(this._can_drop()){
                                                this._drop();
                                                this._temp1=0;
                                            }
                                        }
                                    }else{
                                        if(this._can_drop()){
                                            this._drop();
                                            this._temp1=0;
                                        }
                                        flag=false;
                                    }
                                    break;
                                case 2:
                                    this._temp2++;
                                    if(this._can_drop()){
                                        if(this._timer_restore<=this._config.restore){
                                            this._temp2=0;
                                            this._timer_restore++;
                                        }
                                        this._complete=1;
                                        if(this._local_config.drop_delay<=0){
                                            flag=false;
                                        }
                                    }
                                    if(this._local_config.lock_delay>0){
                                        if(this._temp2>=this._local_config.lock_delay){
                                            this._hard_drop();
                                            this._this_block.visible=false;
                                            this._mask_block.type=this._this_block.type;
                                            this._mask_block.spin=this._this_block.spin;
                                            this._mask_block.x=this._this_block.x;
                                            this._mask_block.y=this._this_block.y;
                                            this._mask_block.visible=1;
                                            this._clear_lines();
                                            if(this._mask_lines.length){
                                                this._complete=3;
                                            }else{
                                                this._drop_lines();
                                                this._complete=0;
                                                if(this._local_config.are<=0){
                                                    flag=false;
                                                }
                                            }
                                            this._temp1=0;
                                            this._temp2=0;
                                        }
                                    }else{
                                        this._hard_drop();
                                        this._this_block.visible=false;
                                        this._mask_block.type=this._this_block.type;
                                        this._mask_block.spin=this._this_block.spin;
                                        this._mask_block.x=this._this_block.x;
                                        this._mask_block.y=this._this_block.y;
                                        this._mask_block.visible=1;
                                        this._clear_lines();
                                        if(this._mask_lines.length){
                                            this._complete=3;
                                        }else{
                                            this._drop_lines();
                                            this._complete=0;
                                        }
                                        this._temp1=0;
                                        this._temp2=0;
                                        flag=false;
                                    }
                                    break;
                                case 3:
                                    this._temp3++;
                                    if(this._temp3>=2){
                                        this._drop_lines();
                                        this._mask_lines=[];
                                        this._temp3=0;
                                        this._complete=0;
                                    }
                                    break;
                                case 4:
                                    this._drop_lines();
                                    this._state.range[this._state.range.length-1] && (this._state.range[this._state.range.length-1].end=new Date().getTime());
                                    this._render(true);
                                    this._info_div.style.display="";
                                    this._info_text_div.innerHTML=this._game_over(this._state).join("<br />");
                                    this._complete=5;
                                    break;
                            }
                            if(flag){
                                break;
                            }
                        }
                    }
                    TSnakeEX.each(this._keys,function(k){
                        this.temp={};
                        this.temp.number=k;
                        this.temp.isdown=this.check_isdown();
                        this.temp.end=-1;
                        this.temp.priority=0;
                    });
                    switch(true){
                        case this._keys[2].isdown && this._keys[3].isdown:
                            if(this._keys[2].start>=this._keys[3].start){
                                this._keys[3].temp.isdown=-2;
                            }else{
                                this._keys[2].temp.isdown=-2;
                            }
                            break;
                    }
                    this._keys.sort(function(a,b){
                        return b.temp.priority-a.temp.priority || a.temp.number-b.temp.number;
                    });
                    while(true){
                        var all_end=true;
                        TSnakeEX.each(this._keys,function(){
                            if(this.temp.isdown!=0){
                                var not_add=false;
                                switch(this.temp.isdown){
                                    case -2:
                                        if(this.count>=0){
                                            this.count=-this.das();
                                        }
                                        not_add=true;
                                        break;
                                    case 1:
                                        if(this.temp.end!=1){
                                            this.action();
                                            this.temp.end=1;
                                        }
                                        break;
                                    case 2:
                                        if(this.temp.end!=1){
                                            if(!this.action()){
                                                not_add=true;
                                            }
                                            this.temp.end=1;
                                        }
                                        break;
                                    case 3:
                                        if(this.temp.end==-1){
                                            this.temp.end=0;
                                        }
                                        var ret=this.action();
                                        if(this.temp.end==0){
                                            if(!ret){
                                                this.temp.end=1;
                                            }
                                        }
                                        if(ret){
                                            this.temp.end=0;
                                        }
                                        not_add=true;
                                        break;
                                }
                                if(this.temp.end!=0){
                                    if(!not_add){
                                        if(this.count>=0){
                                            if(this.arr()!=0){
                                                this.count=(this.count+1)%this.arr();
                                            }
                                        }else{
                                            this.count++;
                                        }
                                    }
                                }
                            }
                            if(this.temp.end==0){
                                all_end=false;
                            }
                        });
                        if(all_end){
                            break;
                        }
                    }
                    this._keys.sort(function(a,b){
                        return a.temp.number-b.temp.number;
                    });
                    TSnakeEX.each(this._keys,function(){
                        delete this.temp;
                    });
                    this._state.frames++;
                }
                this._render();
                this._state.render_frames++;
            }
        },
        _render:function(bool){
            var self=this;
            var i,j,t,e,f,back,image;
            this._console_temp=(this._console_temp+1)%5;
            if(bool || this._console_temp==0){
                this._console.innerHTML=this._local_config.update_console(this._state);
                var progress=this._local_config.update_progress(this._state);
                if(progress>1){
                    progress=1;
                }
                progress=(1-progress)*100;
                this._progress_inner.style.height=progress+"%";
            }
            this._buffer_context.clearRect(0,0,64,64);
            this._buffer_context.fillStyle="#000000";
            this._buffer_context.fillRect(0,0,64,64);
            image=this._config.blocks[this._next_block].image;
            for(i=0;i<4;i++){
                for(j=0;j<4;j++){
                    if(this._config.blocks[this._next_block].data[0].data[j][i]==1){
                        this._buffer_context.drawImage(image,i*16,j*16,16,16);
                    }
                }
            }
            this._next_context.putImageData(this._buffer_context.getImageData(0,0,64,64),0,0);
            this._buffer_context.clearRect(0,0,40,40);
            this._buffer_context.fillStyle="#000000";
            this._buffer_context.fillRect(0,0,40,40);
            if(this._hold_block!=-1){
                image=this._config.blocks[this._hold_block].image;
                this._buffer_context.fillStyle="rgba(0,0,0,0.5)";
                for(i=0;i<4;i++){
                    for(j=0;j<4;j++){
                        if(this._config.blocks[this._hold_block].data[0].data[j][i]==1){
                            this._buffer_context.drawImage(image,i*10,j*10,10,10);
                            if(this._has_hold){
                                this._buffer_context.fillRect(i*10,j*10,10,10);
                            }
                        }
                    }
                }
            }
            this._hold_context.putImageData(this._buffer_context.getImageData(0,0,40,40),0,0);
            this._buffer_context.clearRect(0,0,160,320);
            this._buffer_context.fillStyle="#000000";
            this._buffer_context.fillRect(0,0,160,320);
            for(i=0;i<10;i++){
                for(j=0;j<20;j++){
                    if((t=this._main[j+this._config.rect.top][i+this._config.rect.left])!=-1 && !this._local_config.invisible){
                        this._buffer_context.drawImage(this._config.blocks[t].image,i*16,j*16,16,16);
                    }
                }
            }
            if(this._this_block.visible){
                if(this._local_config.ghost){
                    var ghost_block=TSnakeEX.extend({},this._this_block);
                    while(this._check(ghost_block.type,ghost_block.spin,ghost_block.x,ghost_block.y+1)){
                        ghost_block.y++;
                    }
                    image=this._config.blocks[ghost_block.type].image;
                    this._buffer_context.fillStyle="rgba(0,0,0,0.5)";
                    for(i=0;i<4;i++){
                        for(j=0;j<4;j++){
                            e=ghost_block.x+i;
                            f=ghost_block.y+j;
                            if(this._config.blocks[ghost_block.type].data[ghost_block.spin].data[j][i]==1 && this._check_in_view_ground(e,f)){
                                this._buffer_context.drawImage(image,e*16,f*16,16,16);
                                this._buffer_context.fillRect(e*16,f*16,16,16);
                            }
                        }
                    }
                }
                image=this._config.blocks[this._this_block.type].image;
                if(this._local_config.lock_delay<=0){
                    this._buffer_context.fillStyle="rgba(0,0,0,0)";
                }else{
                    this._buffer_context.fillStyle=TSnakeEX.String.format("rgba(0,0,0,{0})",this._temp2/this._local_config.lock_delay/2);
                }
                for(i=0;i<4;i++){
                    for(j=0;j<4;j++){
                        e=this._this_block.x+i;
                        f=this._this_block.y+j;
                        if(this._config.blocks[this._this_block.type].data[this._this_block.spin].data[j][i]==1 && this._check_in_view_ground(e,f)){
                            this._buffer_context.drawImage(image,e*16,f*16,16,16);
                            this._buffer_context.fillRect(e*16,f*16,16,16);
                        }
                    }
                }
            }
            if(this._mask_block.visible!=0){
                image=this._config.blocks[this._mask_block.type].image;
                this._buffer_context.fillStyle="rgba(255,255,255,0.8)";
                for(i=0;i<4;i++){
                    for(j=0;j<4;j++){
                        e=this._mask_block.x+i;
                        f=this._mask_block.y+j;
                        if(this._config.blocks[this._mask_block.type].data[this._mask_block.spin].data[j][i]==1 && this._check_in_view_ground(e,f)){
                            this._buffer_context.drawImage(image,e*16,f*16,16,16);
                            this._buffer_context.fillRect(e*16,f*16,16,16);
                        }
                    }
                }
            }
            this._buffer_context.fillStyle="rgba(255,255,255,0.8)";
            TSnakeEX.each(this._mask_lines,function(){
                if(this>=0){
                    self._buffer_context.fillRect(0,this*16,160,16);
                }
            });
            TSnakeEX.each(this._break_blocks,function(){
                var c=Math.round(this.count);
                if(c>=0){
                    var t=self._config.blocks[this.type];
                    var w=t.break_width;
                    var h=t.break_height;
                    var x=c%w;
                    var y=(c-x)/w;
                    self._buffer_context.drawImage(
                        t.break_image,
                        x*t.break_image_width,
                        y*t.break_image_height,
                        t.break_image_width,
                        t.break_image_height,
                        this.x*16+8-t.break_x,
                        this.y*16+8-t.break_y,
                        t.break_image_width,
                        t.break_image_height
                    );

                }
            });
            this._main_context.putImageData(this._buffer_context.getImageData(0,0,160,320),0,0);
        },
        _history_4:function(){
            var rnd;
            for(var i=0;i<4;i++){
                rnd=Math.floor(Math.random()*this._config.blocks.length);
                if(TSnakeEX.Array.indexOf(this._history,rnd)==-1){
                    break;
                }
            }
            this._history.shift();
            this._history.push(rnd);
            return rnd;
        },
        _dead:function(){
            return !this._check(this._this_block.type,this._this_block.spin,this._this_block.x,this._this_block.y);
        },
        _hold:function(){
            var hold;
            if(this._complete==0){
                if(this._hold_block==-1){
                    this._hold_block=this._this_block.type;
                    this._next_block=this._history_4();
                    this._this_block.type=this._next_block;
                    this._this_block.spin=0;
                    this._this_block.x=this._config.blocks[this._this_block.type].offset.x;
                    this._this_block.y=this._config.blocks[this._this_block.type].offset.y;
                    this._this_block.visible=false;
                    this._need_next=true;
                }else{
                    hold=this._hold_block;
                    this._hold_block=this._this_block.type;
                    this._next_block=this._this_block.type=hold;
                    this._this_block.spin=0;
                    this._this_block.x=this._config.blocks[this._this_block.type].offset.x;
                    this._this_block.y=this._config.blocks[this._this_block.type].offset.y;
                    this._this_block.visible=false;
                    this._need_next=true;
                }
            }else{
                if(this._hold_block==-1){
                    this._hold_block=this._this_block.type;
                    this._this_block.type=this._next_block;
                    this._this_block.spin=0;
                    this._this_block.x=this._config.blocks[this._this_block.type].offset.x;
                    this._this_block.y=this._config.blocks[this._this_block.type].offset.y;
                    this._this_block.visible=true;
                    this._need_next=true;
                }else{
                    hold=this._hold_block;
                    this._hold_block=this._this_block.type;
                    this._this_block.type=hold;
                    this._this_block.spin=0;
                    this._this_block.x=this._config.blocks[this._this_block.type].offset.x;
                    this._this_block.y=this._config.blocks[this._this_block.type].offset.y;
                    this._this_block.visible=true;
                    this._need_next=false;
                }
            }
            this._has_hold=true;
        },
        _can_hold:function(){
            return !this._has_hold;
        },
        _drop:function(){
            this._this_block.y++;
            this._action_before="drop";
        },
        _hard_drop:function(){
            while(this._can_drop()){
                this._drop();
            }
            for(var i=0;i<4;i++){
                for(var j=0;j<4;j++){
                    if(this._config.blocks[this._this_block.type].data[this._this_block.spin].data[j][i]==1){
                        this._main[this._this_block.y+this._config.rect.top+j][this._this_block.x+this._config.rect.left+i]=this._this_block.type;
                    }
                }
            }
            this._state.blocks++;
        },
        _can_drop:function(){
            return this._check(this._this_block.type,this._this_block.spin,this._this_block.x,this._this_block.y+1);
        },
        _move_left:function(){
            this._this_block.x--;
            this._action_before="move left";
        },
        _can_move_left:function(){
            return this._check(this._this_block.type,this._this_block.spin,this._this_block.x-1,this._this_block.y);
        },
        _move_right:function(){
            this._this_block.x++;
            this._action_before="move right";
        },
        _can_move_right:function(){
            return this._check(this._this_block.type,this._this_block.spin,this._this_block.x+1,this._this_block.y);
        },
        _rotate_left:function(){
            this._this_block.spin=(this._this_block.spin+3)%4;
            var offset=this._check_rotate(this._this_block.type,this._this_block.spin,this._this_block.x,this._this_block.y,"R");
            this._this_block.x+=offset[0];
            this._this_block.y+=offset[1];
            if(offset[0]==0 && offset[1]==0){
                this._has_wall_kick=false;
            }else{
                this._has_wall_kick=true;
            }
            this._action_before="rotate left";
        },
        _can_rotate_left:function(){
            return this._check_rotate(this._this_block.type,(this._this_block.spin+3)%4,this._this_block.x,this._this_block.y,"R");
        },
        _rotate_right:function(){
            this._this_block.spin=(this._this_block.spin+1)%4;
            var offset=this._check_rotate(this._this_block.type,this._this_block.spin,this._this_block.x,this._this_block.y,"L");
            this._this_block.x+=offset[0];
            this._this_block.y+=offset[1];
            if(offset[0]==0 && offset[1]==0){
                this._has_wall_kick=false;
            }else{
                this._has_wall_kick=true;
            }
            this._action_before="rotate right";
        },
        _can_rotate_right:function(){
            return this._check_rotate(this._this_block.type,(this._this_block.spin+1)%4,this._this_block.x,this._this_block.y,"L");
        },
        _check:function(type,spin,x,y){
            for(var i=0;i<4;i++){
                for(var j=0;j<4;j++){
                    if(this._config.blocks[type].data[spin].data[j][i]==1 && (this._main[y+this._config.rect.top+j][x+this._config.rect.left+i]!=-1 || !this._check_in_block_ground(x+i,y+j))){
                        return false;
                    }
                }
            }
            return true;
        },
        _check_rotate:function(type,spin,x,y,rotate){
            for(var i=0;i<this._config.blocks[type].data[spin].wall_kick[rotate].length;i++){
                if(this._check(type,spin,x+this._config.blocks[type].data[spin].wall_kick[rotate][i][0],y+this._config.blocks[type].data[spin].wall_kick[rotate][i][1])){
                    return this._config.blocks[type].data[spin].wall_kick[rotate][i];
                }
            }
            return false;
        },
        _check_in_view_ground:function(x,y){
            return x>=0 && x<10 && y>=0 && y<20;
        },
        _check_in_block_ground:function(x,y){
            return x>=0 && x<10 && y>=-this._config.rect.top && y<20;
        },
        _check_all_clear:function(){
            for(var i=-this._config.rect.top;i<20;i++){
                for(var j=0;j<10;j++){
                    if(this._main[this._config.rect.top+i][this._config.rect.left+j]!=-1){
                        return false;
                    }
                }
            }
            return true;
        },
        _drop_lines:function(){
            var self=this;
            var lines=0;
            TSnakeEX.each(this._mask_lines,function(){
                self._drop_line(this);
                lines++;
            });
            this._state.lines+=lines;
            if(this._check_all_clear()){
                this._state.score+=2000; //10
            }else{
                if(this._has_back_to_back && (lines!=0 && (this._has_spin || lines==4))){
                    if(this._has_spin){
                        switch(lines){
                            case 1:
                                if(this._has_wall_kick){
                                    this._state.score+=450; //2
                                }else{
                                    this._state.score+=750; //3
                                }
                                break;
                            case 2:this._state.score+=1000;break; //5
                            case 3:this._state.score+=1600;break; //8
                        }
                    }else{
                        switch(lines){
                            case 4:this._state.score+=1200;break; //6
                        }
                    }
                }else{
                    if(this._has_spin){
                        switch(lines){
                            case 0:this._state.score+=100;break; //0
                            case 1:
                                if(this._has_wall_kick){
                                    this._state.score+=300; //1
                                }else{
                                    this._state.score+=500; //2
                                }
                                break;
                            case 2:this._state.score+=800;break; //4
                            case 3:this._state.score+=1200;break; //6
                        }
                    }else{
                        switch(lines){
                            case 1:this._state.score+=100;break; //0
                            case 2:this._state.score+=300;break; //1
                            case 3:this._state.score+=500;break; //2
                            case 4:this._state.score+=800;break; //4
                        }
                    }
                }
                if(lines!=0){
                    if(this._has_spin || lines==4){
                        this._has_back_to_back=true;
                    }else{
                        this._has_back_to_back=false;
                    }
                }
            }
            if(lines==0){
                this._combo_count=-1;
            }else{
                this._combo_count++;
                switch(this._combo_count){
                    case 0:
                        break;
                    case 1:
                    case 2:
                        this._state.score+=200;
                        break;
                    case 3:
                    case 4:
                        this._state.score+=400;
                        break;
                    case 5:
                    case 6:
                        this._state.score+=600;
                        break;
                    default:
                        this._state.score+=800;
                        break;
                }
            }
        },
        _drop_line:function(line){
            var i;
            for(i=line;i>-this._config.rect.top;i--){
                for(var j=0;j<10;j++){
                    this._main[this._config.rect.top+i][this._config.rect.left+j]=this._main[this._config.rect.top+i-1][this._config.rect.left+j];
                }
            }
            for(i=0;i<10;i++){
                this._main[0][this._config.rect.left+i]=-1;
            }
        },
        _clear_lines:function(){
            var self=this;
            for(var i=-this._config.rect.top;i<20;i++){
                if(this._can_clear_line(i)){
                    this._mask_lines.push(i);
                }
            }
            if(this._this_block.type==0 && (this._action_before=="rotate left" || this._action_before=="rotate right")){
                var c=0;
                TSnakeEX.each([
                    [0,1],
                    [0,3],
                    [2,1],
                    [2,3]
                ],function(k,v){
                    if(!self._check_in_block_ground(self._this_block.x+v[0],self._this_block.y+v[1]) || self._main[self._this_block.y+v[1]+self._config.rect.top][self._this_block.x+v[0]+self._config.rect.left]!=-1){
                        c++;
                    }
                });
                if(c>=3){
                    this._has_spin=true;
                }
            }
            TSnakeEX.each(this._mask_lines,function(){
                for(var i=0;i<10;i++){
                    self._break_blocks.push({
                        x:i,
                        y:this,
                        type:self._main[this+self._config.rect.top][i+self._config.rect.left],
                        count:0,
                        speed:Math.random()+1
                    });
                }
            });
            TSnakeEX.each(this._mask_lines,function(){
                self._clear_line(this);
            });
        },
        _clear_line:function(line){
            for(var i=0;i<10;i++){
                this._main[this._config.rect.top+line][this._config.rect.left+i]=-1;
            }
        },
        _can_clear_line:function(line){
            for(var i=0;i<10;i++){
                if(this._main[this._config.rect.top+line][this._config.rect.left+i]==-1){
                    return false;
                }
            }
            return true;
        }
    };
})();
