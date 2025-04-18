﻿using UrlShortener.Data;
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
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Thêm CORS vào builder.Services
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Cấu hình CORS để áp dụng middleware cho mọi yêu cầu
            app.UseCors("AllowAll");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            // Map Controllers (API endpoints)
            app.MapControllers();

            // Map the redirect logic for short URLs
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
