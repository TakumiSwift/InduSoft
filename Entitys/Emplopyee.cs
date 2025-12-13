using System;
using System.Collections.Generic;

namespace InduSoft_Web_Api_App.Entitys;

public class Emplopyee
{
    public int id { get; set; }

    public int department_id { get; set; }

    public int? chief_id { get; set; }

    public string? name { get; set; }

    public int? salary { get; set; }
}
