using System;
class test1{
    static void Main(){
        int a=0;
        try
        {
            int result = 10 / a;
        }
        catch (DivideByZeroException ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
        finally
        {
            Console.WriteLine("This will always run.");
        }
    }
}



/*
1. DivideByZeroException
2. FormatException
3. ArgumentNullException
4. IndexOutOfRangeException
5. IOException
.... 
*/