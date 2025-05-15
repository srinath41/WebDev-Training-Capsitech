using System;
class InsufficientFundsException : Exception
{
    public double Balance { get; set; }
    public double WithdrawalAmount { get; set; }

    public InsufficientFundsException(string message, double balance, double withdrawalAmount) 
        : base(message)
    {
        Balance = balance;
        WithdrawalAmount = withdrawalAmount;
    }
}

class Program
{
    static void Withdraw(double balance, double amount)
    {
        if (amount > balance)
        {
            throw new InsufficientFundsException("Not enough funds", balance, amount);
        }
        Console.WriteLine("Withdrawal successful!");
    }

    static void Main()
    {
        try
        {
            Withdraw(100, 150);
        }
        catch (InsufficientFundsException ex)
        {
            Console.WriteLine(ex.Message + ": Attempted to withdraw " + ex.WithdrawalAmount + " with balance " + ex.Balance);

        }
    }
}
