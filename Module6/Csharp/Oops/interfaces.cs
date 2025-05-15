interface IDriveable
{
    void Drive();
}

abstract class Vehicle
{
    public abstract void Start();

    public void Stop()
    {
        Console.WriteLine("Vehicle stopped");
    }
}

class Car : Vehicle, IDriveable
{
    public override void Start()
    {
        Console.WriteLine("Car started");
    }

    public void Drive()
    {
        Console.WriteLine("Car is driving");
    }
}

var car = new Car();
car.Start();
car.Drive();
car.Stop();
