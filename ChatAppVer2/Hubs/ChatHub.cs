using Microsoft.AspNetCore.SignalR;

namespace ChatAppVer2.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            DateTime current = DateTime.Now;
            string now = $"{current:HH:MM}";
            message += ("&" + now);
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}