using UrlShortener.Data;
using Microsoft.EntityFrameworkCore;

namespace UrlShortener
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseCors(policy =>
                policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
            );

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();
            
            app.MapGet("/{shortCode}", async (string shortCode, AppDbContext dbContext) =>
            {
                var shortUrl = await dbContext.ShortUrls.FirstOrDefaultAsync(s => s.ShortCode == shortCode);

                if (shortUrl == null)
                {
                    return Results.NotFound("Short URL không tồn tại.");
                }

                return Results.Redirect(shortUrl.OriginalUrl);
            });


            app.Run();
        }
    }
}
