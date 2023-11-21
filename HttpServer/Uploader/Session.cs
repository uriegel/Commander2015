using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Uploader
{
    class Session
    {
        public string Name { get; private set; }
        public string ID { get; private set; }

        public Session(string name)
        {
            Name = name;
            ID = Guid.NewGuid().ToString();
        }
    }
}
