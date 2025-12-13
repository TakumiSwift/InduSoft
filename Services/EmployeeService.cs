using InduSoft_Web_Api_App.ContextDB;
using InduSoft_Web_Api_App.Entitys;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Threading.Tasks;

namespace InduSoft_Web_Api_App.Services
{
    public class EmployeeService
    {

        private readonly DataDbContext contextDb;

        public EmployeeService(DataDbContext context)
        {
            contextDb = context;
        }

        /// <summary>
        /// Метод вывода всех записей из БД
        /// </summary>
        /// <returns>List всех записей</returns>
        async public Task<List<Emplopyee>> GetAllNotes()
        {
            var result = from item in contextDb.Emplopyees
                         orderby item.id
                         select item;
            return await result.ToListAsync();
        }

        /// <summary>
        /// Метод вывода записи по id
        /// </summary>
        /// <param name="id">id-записи</param>
        /// <returns>Если id существует в БД, то Экз.Emplopyee, Иначе null</returns>
        async public Task<Emplopyee> GetNoteById(int id)
        {
            var result = await contextDb.Emplopyees.FindAsync(id);
            return result;
        }

        /// <summary>
        /// Метод изменения записи
        /// </summary>
        /// <param name="emp">Измененный Экз.Emplopyee</param>
        /// <returns>Измененный Экз.Emplopyee</returns>
        public async Task<Emplopyee> ChangeNote(Emplopyee emp)
        {
            var result = await GetNoteById(emp.id);
            if (result == null)
            {
                return await AddNewNote(emp);
            }
            result.name = emp.name;
            result.salary = emp.salary;
            result.chief_id = emp.chief_id;
            result.department_id = emp.department_id;
            await contextDb.SaveChangesAsync();
            return result;
        }

        /// <summary>
        /// Метод создания новой записи в БД
        /// </summary>
        /// <param name="emp">Новый Экз.Emplopyee</param>
        /// <returns>Новый экз. Emplopyee</returns>
        public async Task<Emplopyee> AddNewNote(Emplopyee emp)
        {
            emp.id = await contextDb.Emplopyees.CountAsync() + 1;
            var result = contextDb.AddAsync(emp);
            await contextDb.SaveChangesAsync();
            return emp;
        }

        /// <summary>
        /// Удаление записи по id
        /// </summary>
        /// <param name="id">id-удаляемой записи</param>
        /// <returns>пустая строка</returns>
        async public Task<bool> DeleteNoteById(int id)
        {
            var employeeForDelete = await GetNoteById(id);
            if (employeeForDelete == null || employeeForDelete.chief_id == null) return false;
            contextDb.Emplopyees.Remove(employeeForDelete);
            contextDb.SaveChanges();
            return true;
        }

        /// <summary>
        /// Метод вызова PostgreSql-функции индексирования зп
        /// </summary>
        /// <param name="dep_id">id-индексируемого департамента</param>
        /// <param name="percent_up">процент индексирования</param>
        /// <returns>временная таблица с результатами выполнения функции</returns>
        async public Task<List<FunctionResult>> UseFunction(int dep_id, decimal percent_up)
        {
            var result = await contextDb.Set<FunctionResult>()
                                        .FromSqlInterpolated(
                                        $"select * from updatesalaryfordepartment({dep_id},{percent_up})")
                                        .ToListAsync();
            return result;
        }

    }
}
