using Microsoft.Win32.SafeHandles;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Drawing;


class Snake_Game
{
 
public static List<List<string>> Generate_Grid(int size)
{
    string Dg = "DG";
    string G = "G";
    List<List<string>> Board = new List<List<string>>();
    for (int i = 0; i <= size; i++)
    {
        Board.Add(new List<string> {});
    }
    for (int i = 0; i <= size; i++)
    {
        for (int j = 0; j <= size; j++)
        {
            if (i % 2 == 0)
            {
                if (j % 2 == 0)
                {
                    Board[i].Add(G);
                }
                else
                {
                    Board[i].Add(Dg);
                }
            }
            else
            {
                if (j % 2 == 0)
                {
                    Board[i].Add(Dg);
                }
                else
                {
                    Board[i].Add(G);
                }
            }
        }
    }
    return Board;
}
static void Print_Grid(List<List<string>> Board, int size)
{
    for(int l = 0; l <= size; l ++)
    {
        foreach(var item in Board[l])
        {
            if (item == "F")
            {
                Console.ForegroundColor = ConsoleColor.Red; 
                Console.Write("██");
            }
            else if (item == "G")
            {
                Console.ForegroundColor = ConsoleColor.Green;  
                Console.Write("██");
            }
            else if (item == "DG")
            {
                Console.ForegroundColor = ConsoleColor.DarkGreen;  
                Console.Write("██");
            }
            else if (item == "SH")
            {
                Console.ForegroundColor = ConsoleColor.DarkBlue;  
                Console.Write("██");
            }
            else if (item == "S")
            {
                Console.ForegroundColor = ConsoleColor.Blue;  
                Console.Write("██");
            }
            else if (item == "SL")
            {
                Console.ForegroundColor = ConsoleColor.DarkCyan;  
                Console.Write("██");
            }
        }
        Console.WriteLine("");
    }
    Console.ResetColor();
}
public static int Generate_Food_x(int size)
{
    Random rnd = new Random();
    int Axisx = rnd.Next(0, size-1);
    return Axisx;
}
 public static int Generate_Food_Y(int size)
{
    Random rnd = new Random();
    int AxisY = rnd.Next(0, size-1);
    return AxisY;
}
public static void Generate_Food(int x, int y, List<List<string>>Grid, int gsize)
{
    if (Grid[y][x] != "SH" || Grid[y][x] != "S" || Grid[y][x] != "SL")
    {
            Grid[y][x] = "F";
    }
}
public static void Movement(List<List<string>>ReferenceGrid, List<List<string>>Grid, int gsize, Point snakehead, List<Point> Snake)
{
    string movement = "W";
    Point LastValue;
    int x = Generate_Food_x(gsize);
    int y = Generate_Food_Y(gsize);
    Thread inputThread = new Thread(() =>
    {
        while (true)
        {
            ConsoleKeyInfo key = Console.ReadKey(true);
            switch (key.Key)
            {
                case ConsoleKey.W:
                    if (movement != "S" && movement != "W")
                    {
                        movement = "W";
                        Thread.Sleep(350);
                    }
                    break;
                case ConsoleKey.S:
                    if (movement != "W" && movement != "S")
                    {
                        movement = "S";
                        Thread.Sleep(350);
                    }
                    break;
                case ConsoleKey.D:
                    if (movement != "A" && movement != "D")
                    {
                        movement = "D";
                        Thread.Sleep(350);
                    }
                    break;
                case ConsoleKey.A:
                    if (movement != "D" && movement != "A")
                    {
                        movement = "A";
                        Thread.Sleep(350);
                    }
                    break;
            }
        }
    });
    inputThread.Start();
    while (true)
    {
        Thread.Sleep(300);
        Grid[snakehead.Y][snakehead.X] = ReferenceGrid[snakehead.Y][snakehead.X];
        if (movement == "W")
        {
            snakehead.Y -= 1;
        }
        else if (movement == "S")
        {
            snakehead.Y += 1;
        }
        else if (movement == "D")
        {
            snakehead.X += 1;
        }
        else if (movement == "A")
        {
            snakehead.X -= 1;
        }
        if (snakehead.X < 0 || snakehead.Y < 0 || snakehead.X > gsize || snakehead.Y > gsize || Grid[snakehead.Y][snakehead.X] == "SH")
        {
            Console.Clear();
            Console.WriteLine("Game Over");
            Environment.Exit(0);
        }
        LastValue = Snake[Snake.Count-1];
        Point Food;
        if (Grid[snakehead.Y][snakehead.X] == "F")
        {
            x = Generate_Food_x(gsize);
            y = Generate_Food_Y(gsize);
            Food = new Point(x, y);
            while (Snake.Contains(Food))
            {
                x = Generate_Food_x(gsize);
                y = Generate_Food_Y(gsize);
                Food = new Point(x, y);
                Generate_Food(x, y, Grid, gsize);
            }
            Generate_Food(x, y, Grid, gsize);
            Snake = AddSnake(Snake, LastValue);
        }
        if(Snake.Contains(snakehead))
        {
            Console.WriteLine("Game Over");
            Environment.Exit(0);
        }
        Snake = UpdateSnake(Snake, snakehead);
        Grid[snakehead.Y][snakehead.X] = "SH";
        for(int i = 1; i <= Snake.Count-1; i++)
        {
            if (i % 2 == 0)
                {
                    Grid[Snake[i].Y][Snake[i].X] = "SL";
                }
                else
                {
                    Grid[Snake[i].Y][Snake[i].X] = "S";
                }
        }
        if(Snake.Count > 1)
        {
            Grid[LastValue.Y][LastValue.X] = ReferenceGrid[LastValue.Y][LastValue.X];
        }
        Console.Clear();
        Print_Grid(Grid, gsize);
        Console.WriteLine("Score: " + Snake.Count);
        Console.WriteLine(x+":"+y);
    }
}

public static List<Point> UpdateSnake(List<Point> Snake,Point snakehead)
{
    Snake.Insert(0, snakehead);
    Snake.RemoveAt(Snake.Count-1);
    return(Snake);
}

public static List<Point> AddSnake(List<Point> Snake, Point LastValue)
{
    Snake.Insert(Snake.Count-1, LastValue);
    return (Snake);
}


static void Main(string[] args)
{
    string size = " ";
    int gsize = 0;
    List<string> Options = new List<string>{ "Small", "small", "Normal", "normal", "Large", "large" };
    while (Options.Contains(size) == false)
    {
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine("      Small | Normal | Large");
    Console.ResetColor();
    Console.WriteLine("How big do you want the game board:");
    size = Console.ReadLine();
    //size = "Normal";
    }
    if (size == "Large" || size == "large")
    {
        gsize = 20;
    }
    if (size == "Normal" || size == "normal")
    {
        gsize = 12;
        
    }
    if (size =="Small" || size == "small")
    {
        gsize = 8;
    }
    List<List<string>>Grid = Generate_Grid(gsize);
    List<List<string>>ReferenceGrid = Generate_Grid(gsize);
    Grid[gsize/2][Convert.ToInt32(Convert.ToDouble(gsize)*0.75)] = "F";
    Grid[gsize/2][Convert.ToInt32(Convert.ToDouble(gsize)*0.25)] = "SH";
    Point snakehead = new Point(Convert.ToInt32(Convert.ToDouble(gsize) * 0.25), (gsize / 2));
    List<Point> Snake = new List<Point>(){snakehead};
    Print_Grid(Grid, gsize);
    while (true)
    {
        Movement(ReferenceGrid, Grid, gsize, snakehead, Snake);
    }
}
}