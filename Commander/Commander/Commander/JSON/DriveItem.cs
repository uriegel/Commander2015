using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

[DataContract]
class DriveItem : IOItem
{
    public DriveItem(string drive)
        : base("images/drive.png", drive, DateTime.Now, false)
    {
    }
}

