using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace MightyGumBall
{
    [DataContract]
    public class Sale
    {
        public Sale()
        {
        }

        public Sale(string name, int sales)
        {
            this.name = name;
            this.sales = sales;

        }

        [DataMember]
        public string name;

        [DataMember]
        public string time;

        [DataMember]
        public int sales;
    }
}
