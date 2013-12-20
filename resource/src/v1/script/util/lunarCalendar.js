//获取农历信息的方法
//ronizhang:准备废弃，没有节假日
jQuery.extend({
    //根据公历获取农历信息
    // 返回：{week:星期几，lunarmonth：农历中文月，lunarday：农历中文日，lunar：农历年月日，ganzhi：干支，animal：生肖}
    getLunarObj: function(date){
        //农历年信息
        var lunarInfo = new Array(
            0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
            0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
            0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
            0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
            0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
            0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
            0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
            0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
            0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
            0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
            0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
            0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
            0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
            0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
            0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0);
        var Animals=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
        var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
        var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
        
        //==== 传回农历 y年的总天数
        function lYearDays(y) {
            var i, sum = 348
            for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0
            return(sum+leapDays(y))
        }
        //==== 传回农历 y年闰月的天数
        function leapDays(y) {
            if(leapMonth(y))   
                return((lunarInfo[y-1900] & 0x10000)? 30: 29)
            else 
                return(0)
        }
        //==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
        function leapMonth(y) { 
            return(lunarInfo[y-1900] & 0xf);
        }
        //==== 传回农历 y年m月的总天数
        function monthDays(y,m) { 
            return((lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
        }
        //==== 算出农历, 传入日期物件, 传回农历日期物件
        //      该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
        function lunar(objDate) {
            var i, leap=0, temp=0
            var baseDate = new Date(1900,0,31)
            var offset    = (objDate - baseDate)/86400000

            this.dayCyl = offset + 40
            this.monCyl = 14

            for(i=1900; i<2050 && offset>0; i++) {
                temp = lYearDays(i)
                offset -= temp
                this.monCyl += 12
            }
            if(offset<0) {
                offset += temp;
                i--;
                this.monCyl -= 12
            }

            this.year = i
            this.yearCyl = i-1864

            leap = leapMonth(i) //闰哪个月
            this.isLeap = false

            for(i=1; i<13 && offset>0; i++) {
                //闰月
                if(leap>0 && i==(leap+1) && this.isLeap==false)
                { --i; this.isLeap = true; temp = leapDays(this.year); }
                else
                { temp = monthDays(this.year, i); }

                //解除闰月
                if(this.isLeap==true && i==(leap+1)) this.isLeap = false

                offset -= temp
                if(this.isLeap == false) this.monCyl ++
            }

            if(offset==0 && leap>0 && i==leap+1)
                if(this.isLeap)
            { this.isLeap = false; }
            else
            { this.isLeap = true; --i; --this.monCyl;}

            if(offset<0){ offset += temp; --i; --this.monCyl; }

            this.month = i
            this.day = offset + 1
        }
        //获取农历（月）中文格式
        function get_lunarmonth(month){
            var fm = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","腊月"];
            return fm[month-1];
        }
        //获取农历（日）中文格式
        function get_lunarday(day){
            var fd = ["十","一","二","三","四","五","六","七","八","九","十"];
            if(day <= 10){
                return "初"+fd[day];
            }
            else if(day < 20){
                return "十"+fd[day-10];
            }
            else if(day==20){
                return "二十";
            }
            else if(day < 30){
                return "廿"+fd[day-20];
            }
            else{
                return "三"+fd[day-30];
            }
        }
        
        //获取干支
        function get_ganzhi(year) { 
            var num = year-1900+36;
            return(Gan[num%10]+Zhi[num%12]); 
        }
        //获取生肖
        function get_animal(year){
            return Animals[(year-4)%12];
        }
        //获取周
        function get_week(date){
            var values = ["日", "一", "二", "三", "四", "五", "六"];
//            date = $.getdate(date);
            return values[date.getDay()];
        }
        
        var viewdate = {};
//        date = $.getdate(date);
        //星期
        viewdate.week = get_week(date);
        //农历信息
        var lunar_obj = new lunar(date);
        //农历中文月
        viewdate.lunarmonth =  get_lunarmonth(lunar_obj.month);
        //农历中文日
        var lunar_day =  Math.floor(lunar_obj.day);
        viewdate.lunarday = get_lunarday(lunar_day);
        //农历年月日
        viewdate.lunar = lunar_obj.year + "-" + lunar_obj.month + "-" + lunar_day;
        //干支
        viewdate.ganzhi = get_ganzhi(lunar_obj.year);
        //生肖
        viewdate.animal = get_animal(lunar_obj.year);
            
        return viewdate;
    }
}); 