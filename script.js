// JavaScript Document
window.onload=function()
{
	main.app.chessGame();
};

var main={};
main.tools={};

main.ui={};
//画棋盘
main.ui.drawChessBoard=function(obj)
{
	for(var i=0;i<15;i++)
	{
		obj.moveTo(15,30*i+15);//留白15，没格30x30
		obj.lineTo(435,30*i+15);
		obj.stroke();
		
		obj.moveTo(30*i+15,15);
		obj.lineTo(30*i+15,435);
		obj.stroke();
	}
};
//画棋子
main.ui.oneStep=function(obj,i,j,black_chess)//行，列索引，黑or白棋
{
	obj.beginPath();
	obj.arc(30*i+15,30*j+15,12,0,2*Math.PI);
	obj.closePath();
	var gradient=obj.createRadialGradient(30*i+15+2,30*j+15-2,12,30*i+15+2,30*j+15-2,1);
	if(black_chess){
		gradient.addColorStop(0,'#0a0a0a');
		gradient.addColorStop(1,'#636766');
	}else{
		gradient.addColorStop(0,'#d1d1d1');
		gradient.addColorStop(1,'#f9f9f9');
	}
	obj.fillStyle=gradient;
	obj.fill();

};
//落子实现
/*main.ui.play_chess=function(obj, x, y, black_chess)
{
	var chessBox=[];//15x15的二维数组,初始化每一个都为0
	for(var m=0;m<15;m++)
	{
		chessBox[m]=[];
		for(var n=0;n<15;n++)
		{
			chessBox[m][n]=0;
		}
	}
	
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBox[i][j]==0)//此位置没有落棋
	{
		main.ui.oneStep(obj,i,j,black_chess);
		black_chess=!black_chess;
		if(black_chess){
			chessBox[i][j]=1;
		}else{
			chessBox[i][j]=2;
		}
	}else
	{return false;}
};*/

main.app={};
main.app.chessGame=function(e)
{
	//赢法数组
	var wins=[];
	for(var k=0;k<15;k++){
		wins[k]=[];
		for(var l=0;l<15;l++)
		{
			wins[k][l]=[];
		}
	}
	var count=0;//赢法种类索引
	for(var a=0;a<15;a++){
		for(var b=0;b<11;b++){
			for(var c=0;c<5;c++)
			{
				wins[a][b+c][count]=true;
			}
			count++;
		}
	}
	//所有竖线的赢法
	for(var q=0;q<15;q++){
		for(var w=0;w<11;w++){
			for(var r=0;r<5;r++)
			{
				wins[w+r][q][count]=true;
			}
			count++;
		}
	}
	//所有正斜线的赢法
	for(var b1=0;b1<11;b1++){
		for(var b2=0;b2<11;b2++){
			for(var b3=0;b3<5;b3++)
			{
				wins[b1+b3][b2+b3][count]=true;
			}
			count++;
		}
	}
	//所有反斜线的赢法
	for(var z=0; z<11; z++){
		for(var x=14; x>3; x--){
			for(var y=0; y<5; y++)
			{
				wins[z+y][x-y][count]=true;
			}
			count++;
		}
	}
	var over=false;//是否结束
	var myWin=[];//我方赢法统计情况
	var computerWin=[];//计算机方赢法统计情况
	for(var n=0;n<count;n++)
	{
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
		main.ui.drawChessBoard(oCC);//画棋盘
	};
	yImg.src="sky.jpg";

	//落子实现
	chess.onclick=function(ev)
	{
		if(over){return;}
		if(!black_chess){return;}
		
		var oEvent=ev||event;
		var x=oEvent.offsetX;
		var y=oEvent.offsetY;
		
		var i=Math.floor(x/30);
		var j=Math.floor(y/30);
		if(chessBox[i][j]==0)//此位置没有落棋
		{
			main.ui.oneStep(oCC,i,j,black_chess);
			chessBox[i][j]=1;
			
			for(var num=0;num<count;num++)
			{
				if(wins[i][j][num])//第num种赢法在(i,j)这里有子
				{
					myWin[num]++;	
					computerWin[num]=6;//异常值，计算机在这不能赢
					if(myWin[num]==5)//5颗子都已落下
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
		for(var i=0;i<15;i++)
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
							if(myWin[k]==1){
								myScore[ii][jj]+=200;	
							}else if(myWin[k]==2){
								myScore[ii][jj]+=400;	
							}else if(myWin[k]==3){
								myScore[ii][jj]+=600;	
							}else if(myWin[k]==4){
								myScore[ii][jj]+=1000;	
							}
							
							if(computerWin[k]==1){
								computerScore[ii][jj]+=220;	
							}else if(computerWin[k]==2){
								computerScore[ii][jj]+=420;	
							}else if(computerWin[k]==3){
								computerScore[ii][jj]+=620;	
							}else if(computerWin[k]==4){
								computerScore[ii][jj]+=1200;	
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
		main.ui.oneStep(oCC,u,v,black_chess);
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
};
//赢法数组：记录了五子棋的所有的赢法（3种）：三维数组
//每一种赢法的统计数组：1维数组
//如何判断胜负
//计算机落子规则

	//所有横线的赢法
	//a=0,b=0,c从0到4时，赢法1
	//wins[0][0][0]=true;
	//wins[0][1][0]=true;
	//wins[0][2][0]=true;
	//wins[0][3][0]=true;
	//wins[0][4][0]=true;//00,01,02,03,04在棋盘上连成线
	
	//a=0,b=1,count=1，c从0到4时，赢法2
	//wins[0][1][1]=true;
	//wins[0][2][1]=true;
	//wins[0][3][1]=true;
	//wins[0][4][1]=true;
	//wins[0][5][1]=true;
