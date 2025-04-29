using Microsoft.AspNetCore.Mvc;
using UrlShortener.Data;
using UrlShortener.Models;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace UrlShortener.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShortenerController : ControllerBase
    {
        private readonly AppDbContext _context; 

        public ShortenerController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/shortener
        [HttpPost("create")]
        public async Task<IActionResult> ShortenUrl([FromBody] string originalUrl)
        {
            if (string.IsNullOrWhiteSpace(originalUrl))
                return BadRequest("Invalid URL.");

            var shortCode = GenerateShortCode();
            var shortUrl = new ShortUrl { OriginalUrl = originalUrl, ShortCode = shortCode };

            _context.ShortUrls.Add(shortUrl);
            await _context.SaveChangesAsync();

            // Lấy base URL từ request thay vì hardcode
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            return Ok(new { shortUrl = $"{baseUrl}/{shortCode}" });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteShortUrl(int id)
        {
            var shortUrl = await _context.ShortUrls.FindAsync(id);
            if (shortUrl == null)
            {
                return NotFound("Short URL not found.");
            }

            _context.ShortUrls.Remove(shortUrl);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Short URL deleted successfully." });
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllShortUrls()
        {
            var urls = await _context.ShortUrls.ToListAsync();
            return Ok(urls);
        }

        
        [Route("{shortCode}")]
        [HttpGet]
        public IActionResult RedirectToOriginal(string shortCode)
        {
            var shortUrl = _context.ShortUrls.FirstOrDefault(s => s.ShortCode == shortCode);

            if (shortUrl == null)
                return NotFound("Short URL does not exist.");

            return Redirect(shortUrl.OriginalUrl);
        }

        // Hàm tạo mã rút gọn
        private string GenerateShortCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var shortCode = new StringBuilder(6);

            for (int i = 0; i < 6; i++)
            {
                shortCode.Append(chars[random.Next(chars.Length)]);
            }

            return shortCode.ToString();
        }
    }
}
