int[] numbers = { 10, 20, 30, 40, 50 };
string[] fruits = new string[] { "Apple", "Banana", "Cherry" };

Console.WriteLine($"First number: {numbers[0]}");
Console.WriteLine($"Second fruit: {fruits[1]}");

Console.WriteLine($"Total numbers: {numbers.Length}");
Console.WriteLine($"Total fruits: {fruits.Length}");

Console.WriteLine("All numbers:");
foreach (int num in numbers)
{
    Console.Write(num + " ");
}

Console.WriteLine("\nAll fruits:");
for (int i = 0; i < fruits.Length; i++)
{
    Console.WriteLine($"fruits[{i}]: {fruits[i]}");
}

numbers[2] = 35;
Console.WriteLine($"Updated third number: {numbers[2]}");

Array.Sort(numbers);

Console.WriteLine("Sorted numbers:");
foreach (int num in numbers)
{
    Console.Write(num + " ");
}

Array.Reverse(fruits);

Console.WriteLine("\nReversed fruits:");
foreach (string fruit in fruits)
{
    Console.Write(fruit + " ");
}

int index = Array.IndexOf(numbers, 40);
Console.WriteLine($"\nIndex of 40: {index}");
