string name = "  Sai Srinath  ";
string sentence = "Welcome to CSharp world!";
string data = "12345";

Console.WriteLine($"Length: {name.Length}");

Console.WriteLine($"Upper: {name.ToUpper()}");
Console.WriteLine($"Lower: {name.ToLower()}");

Console.WriteLine($"Trim: '{name.Trim()}'");

Console.WriteLine($"Substring (0, 3): {sentence.Substring(0, 3)}");

Console.WriteLine($"Contains 'CSharp'? {sentence.Contains("CSharp")}");

Console.WriteLine($"StartsWith 'Welcome'? {sentence.StartsWith("Welcome")}");
Console.WriteLine($"EndsWith 'world!'? {sentence.EndsWith("world!")}");

Console.WriteLine($"Index of 'to': {sentence.IndexOf("to")}");
Console.WriteLine($"Last index of 'o': {sentence.LastIndexOf("o")}");

Console.WriteLine($"Replace 'CSharp' with 'C#': {sentence.Replace("CSharp", "C#")}");

Console.WriteLine($"Insert 'Mr. ' at 0: {name.Insert(0, "Mr. ")}");

Console.WriteLine($"Remove 0 to 3: {sentence.Remove(0, 3)}");

string[] words = sentence.Split(' ');
Console.WriteLine("Words:");
foreach (var word in words)
{
    Console.WriteLine(word);
}

string joined = string.Join("-", words);
Console.WriteLine($"Joined with '-': {joined}");

string emptyStr = "   ";
Console.WriteLine($"IsNullOrEmpty: {string.IsNullOrEmpty(emptyStr)}");
Console.WriteLine($"IsNullOrWhiteSpace: {string.IsNullOrWhiteSpace(emptyStr)}");

int num = int.Parse(data);
Console.WriteLine($"Parsed int: {num}");
