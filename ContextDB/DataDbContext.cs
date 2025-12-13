using InduSoft_Web_Api_App.Entitys;
using Microsoft.EntityFrameworkCore;

namespace InduSoft_Web_Api_App.ContextDB
{
    public class DataDbContext : DbContext
    {

        public DbSet<Department> Departments { get; set; }
        
        public DbSet<Emplopyee> Emplopyees { get; set; }

        public DataDbContext(DbContextOptions<DataDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Department>().ToTable("department")
                                             .HasKey(d => d.id);

            modelBuilder.Entity<Emplopyee>().ToTable("emplopyee")
                                            .HasKey(e => e.id);

            modelBuilder.Entity<FunctionResult>(entity =>
            {
                entity.HasNoKey(); // Указываем, что нет первичного ключа
                entity.ToView(null); // Не связан с таблицей/представлением
            });

        }

    }
}
