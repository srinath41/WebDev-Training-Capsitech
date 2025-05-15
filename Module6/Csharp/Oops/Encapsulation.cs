class BankAccount
{
    // Private fields (encapsulated data)
    private double balance;

    public double GetBalance()
    {
        return balance;
    }

    public void Deposit(double amount)
    {
        if (amount > 0)
        {
            balance += amount;
        }
    }

    public void Withdraw(double amount)
    {
        if (amount > 0 && amount <= balance)
        {
            balance -= amount;
        }
    }
}

var account = new BankAccount();
account.Deposit(1000);
Console.WriteLine(account.GetBalance());
account.Withdraw(500);
Console.WriteLine(account.GetBalance());
