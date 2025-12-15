using InduSoft_Web_Api_App.ContextDB;
using InduSoft_Web_Api_App.Entitys;
using InduSoft_Web_Api_App.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;


namespace InduSoft_Web_Api_App.Controllers
{

    [Route("api/table/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        
        private readonly EmployeeService employeeService;

        public EmployeeController(EmployeeService employeeService)
        {
            this.employeeService = employeeService;
        }

        // GET: api/table/employee
        [HttpGet]
        public async Task<ActionResult<List<Emplopyee>>> GetAllEmployee()
        {
            var result = await employeeService.GetAllNotes();
            return Ok(result);
        }

        // GET api/table/employee/idOfEmployee
        [HttpGet("{id}")]
        public async Task<ActionResult<Emplopyee>> GetEmployeeById(int id)
        {
            var result = await employeeService.GetNoteById(id);
            if (result == null)
            {
                return Ok("");
            }
            return Ok(result);
        }

        // POST api/table/employee
        [HttpPost]
        public async Task<ActionResult<Emplopyee>> Post([FromBody] Emplopyee emp)
        {
            var result = await employeeService.ChangeNote(emp);
            return Ok(result);
        }

        // DELETE api/table/employee/idOfEmployee
        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> DeleteEmployeeById(int id)
        {
            var result = await employeeService.DeleteNoteById(id);
            if (result) return Ok("");
            return Ok("Ошибка удаления: Сотрудник является руководителем");
        }

        // Get api/table/employee/updatesalaryfordepartment
        [HttpGet("updatesalaryfordepartment")]
        public async Task<ActionResult<List<FunctionResult>>> IndexDepartment([FromQuery] int dep_id,
                                                                              [FromQuery] decimal percent_up)
        {
            var result = await employeeService.UseFunction(dep_id, percent_up);
            return Ok(result);
        }

    }
}
