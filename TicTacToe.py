from tkinter import *
import random
from tkinter import messagebox
import sys
import copy

stop_game = False
turns = 0

def turn(turns):
    if turns % 2 == 0:
        return 'X'
    else:
        return 'O'

def Find_MiniMax_Turn(turns):
    if turns % 2 == 0:
        return 'O'
    else:
        return 'X'

def turn_to_colour():
    if turn(turns) == 'X':
        return 'Green'
    else:
        return 'Red'


def find_available_move(Board):
    available_moves = []
    current_move = []
    for row in range(3):
        for column in range(3):
            if Board[row][column] == 0:
                current_move.append(row)
                current_move.append(column)
                available_moves.append(current_move)
                current_move = []
    return available_moves
                

def MiniMax(MiniMax_Board, MiniMax_Turn):
    if MiniMaxWin(MiniMax_Board, MiniMax_Turn) == (10 or -10) or  find_available_move(MiniMax_Board) == 0:
        return Score
    Score = []
    Score_Reference = []
    Available_Moves = find_available_move(MiniMax_Board)
    Board = copy.deepcopy(MiniMax_Board)
    for Move in range(len(Available_Moves)):
        MiniMax_Board[Available_Moves[Move][0]][Available_Moves[Move][1]] = Find_MiniMax_Turn(MiniMax_Turn)
        MiniMax_Turn += 1
    


    




def BotGo(Board, Tiles):
    global turns
    MiniMax_Board = copy.deepcopy(Board)
    minmaxmove = MiniMax(MiniMax_Board, 0)
    moves = find_available_move(Board)
    row = random.choice(moves)[0]
    column = random.choice(moves)[1]
    if Board[row][column] == 0:
        Tiles[row][column].configure(background='red')
        Board[row][column] = 'O'
        check_if_win(Board)
        turns +=1
    else:
        BotGo(Board, Tiles)
    

def PlayerGo(Board, Tiles, row, column):
    global turns
    if Board[row][column] == 0:
        Tiles[row][column].configure(background='green')
        Board[row][column] = 'X'
        check_if_win(Board)
        turns+=1
        if len(find_available_move(Board)) != 0:
            BotGo(Board, Tiles)

def check_if_win(Board):
    if Board[0][0] == turn(turns) and Board[0][1] == turn(turns) and Board[0][2] == turn(turns):
        
        winner = messagebox.showinfo('Winner', turn_to_colour() + ' Won')
        sys.exit("Game Over")	

    elif Board [1][0] == turn(turns) and Board[1][1] == turn(turns) and Board[1][2] == turn(turns):
        
        winner = messagebox.showinfo('Winner', turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	

    elif Board[2][0] == turn(turns) and Board[2][1] == turn(turns) and Board[2][2] == turn(turns):
        
        winner = messagebox.showinfo('Winner', turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	

    elif Board[0][0] == turn(turns) and Board[1][0] == turn(turns) and Board[2][0] == turn(turns):
        
        winner = messagebox.showinfo('Winner' , turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	

    elif Board[0][1] == turn(turns) and Board[1][1] == turn(turns) and Board[2][1] == turn(turns):
        
        winner = messagebox.showinfo('Winner' , turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	
    
    elif Board[0][2] == turn(turns) and Board[1][2] == turn(turns) and Board[2][2] ==turn(turns):
        
        winner = messagebox.showinfo('Winner' , turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	
    
    elif Board[0][0] == turn(turns) and Board[1][1] == turn(turns) and Board[2][2] ==turn(turns):
        
        winner = messagebox.showinfo('Winner' , turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	
    elif Board[0][2] == turn(turns) and Board[1][1] == turn(turns) and Board[2][0] ==turn(turns):
        
        winner = messagebox.showinfo('Winner' , turn_to_colour()+ ' Won!')
        sys.exit("Game Over")	
    elif len(find_available_move(Board)) == 0:
        
        messagebox.showinfo('Tie', 'It was a ie')
        sys.exit("Game Over")	

def MiniMaxWin(board, turns):
    if board[0][0] == turn(turns) and board[0][1] == turn(turns) and board[0][2] == turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board [1][0] == turn(turns) and board[1][1] == turn(turns) and board[1][2] == turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board[2][0] == turn(turns) and board[2][1] == turn(turns) and board[2][2] == turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board[0][0] == turn(turns) and board[1][0] == turn(turns) and board[2][0] == turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board[0][1] == turn(turns) and board[1][1] == turn(turns) and board[2][1] == turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board[0][2] == turn(turns) and board[1][2] == turn(turns) and board[2][2] ==turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board[0][0] == turn(turns) and board[1][1] == turn(turns) and board[2][2] ==turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    elif board[0][2] == turn(turns) and board[1][1] == turn(turns) and board[2][0] ==turn(turns):
        if turn(turns) == 'O':
            return 10 - turns
        else:
            return turns - 10
    else:
        return 0



Game = Tk()
Game.geometry()
Game.title('Tic Tac Toe')
frame = Frame(Game)
frame.grid()
grid = Frame(frame)  
grid.grid(column=3, row=3)
Tiles = [[0,0,0],
        [0,0,0],
        [0,0,0]]
Board = [[0,0,0],
        [0,0,0],
        [0,0,0]]
for i in range(3):
    for j in range(3):
        Tiles[i][j] = Button(grid, height=10, width=22, command = lambda r = i, c = j : PlayerGo(Board, Tiles, r,c))
        Tiles[i][j].grid(row=i, column=j)

Game.mainloop()







