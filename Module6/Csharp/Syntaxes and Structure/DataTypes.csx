// Value Types
int x = 10;
int y = x; // y is a copy of x
y = 20;    // Changing y doesn't affect x

Console.WriteLine("Value Types:");
Console.WriteLine($"x = {x}, y = {y}"); // x = 10, y = 20


// Reference Types
class Person
{
    public string Name;
}

Person a = new Person();
a.Name = "John";

Person b = a;
b.Name = "Alice";

Console.WriteLine("\nReference Types:");
Console.WriteLine($"a.Name = {a.Name}, b.Name = {b.Name}"); 


// Nullable Types
int? nullableInt = null;
bool? nullableBool = true;

Console.WriteLine("\nNullable Types:");
if (nullableInt.HasValue)
{
    Console.WriteLine($"nullableInt = {nullableInt.Value}");
}
else
{
    Console.WriteLine("nullableInt is null");
}

Console.WriteLine($"nullableBool = {nullableBool}");

nullableInt = 100;
Console.WriteLine($"nullableInt now has a value: {nullableInt.Value}");
