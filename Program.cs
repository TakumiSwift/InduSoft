
using InduSoft_Web_Api_App.ContextDB;
using InduSoft_Web_Api_App.Services;
using Microsoft.EntityFrameworkCore;
using System;

namespace InduSoft_Web_Api_App
{
    public class Program
    {
        public static void Main(string[] args)
        {            

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<DataDbContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddScoped<EmployeeService>();

            builder.Services.AddControllers();
            
            //builder.Services.AddHttpClient<ApiService>(client =>
            //{
            //    client.BaseAddress = new Uri("https://localhost:44305/api/");
            //    client.DefaultRequestHeaders.Add("Accept", "application/json");
            //});

            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();

        }
    }
}
