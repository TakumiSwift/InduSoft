using InduSoft_Web_Api_App.Entitys;

namespace InduSoft_Web_Api_App.Services
{
    public class ApiService
    {

        private readonly HttpClient httpClient;

        public ApiService(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public async Task<List<Emplopyee>> GetAllEmployee()
        {
            var req = await httpClient.GetAsync("table/employees/");
            var employee = await req.Content.ReadFromJsonAsync<List<Emplopyee>>();
            return employee;
        }

        public async Task<Dictionary<int,Emplopyee>> GetEmplopyeeById(int id)
        {
            var req = await httpClient.GetAsync($"table/employees/{id}");
            var employee = await req.Content.ReadFromJsonAsync<Emplopyee>();
            var result = new Dictionary<int, Emplopyee>() { { id, employee } };
            return result;
        }

    }
}
