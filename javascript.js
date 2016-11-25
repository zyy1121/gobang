// JavaScript Document

//赢法数组
var wins=[];
for(var k=0;k<15;k++)
{
	wins[k]=[];
	for(var l=0;l<15;l++){
		wins[k][l]=[];
	}
}
var count=0;//赢法种类索引
//所有横线的赢法
for(var a=0;a<15;a++){
	for(var b=0;b<11;b++){
		for(var c=0;c<5;c++){
			wins[a][b+c][count]=true;
		}
		count++;
	}
}
//所有竖线的赢法
for(var q=0;q<15;q++){
	for(var w=0;w<11;w++){
		for(var r=0;r<5;r++){
			wins[w+r][q][count]=true;
		}
		count++;
	}
}
//所有正斜线的赢法
for(var b1=0;b1<11;b1++){
	for(var b2=0;b2<11;b2++){
		for(var b3=0;b3<5;b3++){
			wins[b1+b3][b2+b3][count]=true;
		}
		count++;
	}
}
//所有反斜线的赢法
for(var a=0; a<11; a++){//11,12,13,14,15
	for(var b=14; b>3; b--){//3,2,1,0
		for(var c=0; c<5; c++){
			wins[a+c][b-c][count]=true;
		}
		count++;
	}
}

var over=false;
var myWin=[];//我方赢法统计情况
var computerWin=[];//计算机方赢法统计情况
for(var n=0;n<count;n++){
	myWin[n]=0;
	computerWin[n]=0;
}


var chess=document.getElementById("chess");
var oCC=chess.getContext("2d");

var black_chess=true;//黑子先行
var chessBox=[];//15x15的二维数组
for(var i=0;i<15;i++)
{
	chessBox[i]=[];
	for(var j=0;j<15;j++)
	{
		chessBox[i][j]=0;
	}
}

var yImg=new Image();
yImg.onload=function()
{
	oCC.strokeStyle="#bfbfbf";
	oCC.drawImage(this,0,0,450,450);//绘制棋盘水印
	drawChessBoard();	
};
yImg.src="sky.jpg";

//画棋盘
var drawChessBoard=function()
{
	for(var i=0;i<15;i++)
	{
		oCC.moveTo(15,30*i+15);//留白15，每格30x30//画竖线
		oCC.lineTo(435,30*i+15);
		oCC.stroke();
		
		oCC.moveTo(30*i+15,15);//画横线
		oCC.lineTo(30*i+15,435);
		oCC.stroke();
	}
};

//绘制棋子
var oneStep=function(i,j,black_chess)//行，列索引，黑or白棋
{
	oCC.beginPath();
	oCC.arc(30*i+15,30*j+15,12,0,2*Math.PI);
	oCC.closePath();
	var gradient=oCC.createRadialGradient(30*i+15+2,30*j+15-2,12,30*i+15+2,30*j+15-2,1);
	if(black_chess){
		gradient.addColorStop(0,'#0a0a0a');
		gradient.addColorStop(1,'#636766');
	}else{
		gradient.addColorStop(0,'#d1d1d1');
		gradient.addColorStop(1,'#f9f9f9');
	}
	oCC.fillStyle=gradient;
	oCC.fill();

};

//落子实现
chess.onclick=function(ev)
{
	if(over){return;}
	if(!black_chess){return;}//只有黑棋执行下面代码
	
	var oEvent=ev||event;
	
	var x=oEvent.offsetX;
	var y=oEvent.offsetY;
		
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBox[i][j]==0)//此位置没有落棋
	{
		oneStep(i,j,black_chess);
		chessBox[i][j]=1;
		for(var k=0;k<count;k++)
		{
			if(wins[i][j][k])//第k种赢法在(i,j)这里有子
			{
				myWin[k]++;	
				computerWin[k]=6;
				if(myWin[k]==5)
				{
					alert("恭喜你获得胜利！");
					over=true;
				}
			}
		}
		if(!over)
		{
			black_chess=!black_chess;
			computerAI();
		}
	}
};

var computerAI=function(){
	var myScore=[];
	var computerScore=[];
	var max=0;
	var u=0,v=0;//最高分数点的坐标
	for(var i=0;i<15;i++)//初始化二维分数数组
	{
		myScore[i]=[];	
		computerScore[i]=[];
		for(var j=0;j<15;j++)
		{
			myScore[i][j]=0;	
			computerScore[i][j]=0;	
		}
	}
	for(var ii=0;ii<15;ii++){
		for(var jj=0;jj<15;jj++){
			if(chessBox[ii][jj]==0){
				for(var k=0;k<count;k++){//遍历所有赢法，分数会累加，如果这个点在多种赢法中
					if(wins[ii][jj][k])
					{
						if(myWin[k]==1){//如果黑棋在赢法数组中落子一个
							myScore[ii][jj]+=200;	
						}else if(myWin[k]==2){
							myScore[ii][jj]+=800;	
						}else if(myWin[k]==3){
							myScore[ii][jj]+=1000;	
						}else if(myWin[k]==4){
							myScore[ii][jj]+=2000;	
						}
						
						if(computerWin[k]==1){//如果白棋已经落子一颗
							computerScore[ii][jj]+=220;	
						}else if(computerWin[k]==2){
							computerScore[ii][jj]+=820;	
						}else if(computerWin[k]==3){
							computerScore[ii][jj]+=2200;	
						}else if(computerWin[k]==4){
							computerScore[ii][jj]+=10000;	
						}
					}
				}
				
				if(myScore[ii][jj]>max)
				{
					max=myScore[ii][jj];
					u=ii;
					v=jj;
				}else if(myScore[ii][jj]==max)
				{
					if(computerScore[ii][jj]>computerScore[u][v])
					{
						u=ii;
						v=jj;
					}
				}
				
				if(computerScore[ii][jj]>max)
				{
					max=computerScore[ii][jj];
					u=ii;
					v=jj;
				}else if(computerScore[ii][jj]==max)
				{
					if(myScore[ii][jj]>myScore[u][v])
					{
						u=ii;
						v=jj;
					}
				}
				
			}
		}
	}
	oneStep(u,v,black_chess);
	chessBox[u][v]=2;//计算机在此落子
	for(var num=0;num<count;num++)
	{
		if(wins[u][v][num])//第num种赢法在(i,j)这里有子
		{
			computerWin[num]++;	
			myWin[num]=6;//异常值，计算机在这不能赢
			if(computerWin[num]==5)//5颗子都已落下
			{
				alert("计算机获得胜利！");
				over=true;
			}
		}
	}
	if(!over)
	{
		black_chess=!black_chess;
	}
}; 


//alert(count);

//赢法数组：记录了五子棋的所有的赢法（3种）：三维数组
//每一种赢法的统计数组：1维数组
//如何判断胜负
//计算机落子规则