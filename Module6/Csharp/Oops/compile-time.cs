class Calculator
{
    public int Add(int a, int b)
    {
        return a + b;
    }

    public double Add(double a, double b)
    {
        return a + b;
    }
}

var calc = new Calculator();
Console.WriteLine(calc.Add(5, 10));
Console.WriteLine(calc.Add(5.5, 10.5));
