using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using HttpServer;

namespace Application
{
    class Program
    {
        static void Main(string[] args)
        {
            Configuration configuration = new Configuration();
            XElement config = XElement.Load("config.xml");
            configuration.Webroot = (string)config.Elements("webroot").Attributes("Path").FirstOrDefault();
            configuration.PhpBin = (string)config.Elements("php").Attributes("Path").FirstOrDefault();
            configuration.Extensions = config.Elements("Extensions").Elements("Extension")
                .Select(n => new Extension((string)n.Attribute("Name"), (string)n.Attribute("Path"), (string)n.Attribute("Type"))).ToList();
            configuration.IsTlsEnabled = (bool?)config.Elements("Tls").Attributes("IsEnabled").FirstOrDefault() ?? false;
            configuration.AppCaches = config.Elements("appcaches").Elements("appcache").Select(n => (string)n.Attribute("Name")).ToArray();
            configuration.Port = (int?)config.Elements("connection").Attributes("port").FirstOrDefault() ?? 0;

            Server server = new Server(configuration);

            server.Start();
            while (true)
            {
                switch (Console.ReadLine())
                {
                    case "":
                        return;
                    case "clr":
                        Console.Clear();
                        break;
                }
            }
        }
    }
}
