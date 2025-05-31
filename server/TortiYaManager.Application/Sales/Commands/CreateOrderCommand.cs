using SharedLib.CQRS;
using TortiYaManager.Application.Sales.DTOs;

namespace TortiYaManager.Application.Sales.Commands;

public class CreateOrderCommand
{
    public record CommandArgs(NewOrderDto NewOrder);
    public record CommandResult(OrderDto Order);

    public class Handler : AppRequestHandler<CommandArgs, CommandResult>
    {
        protected override Task<CommandResult> ExecuteAsync(CommandArgs args, CancellationToken cancellationToken = default)
        {
            var order = args.NewOrder.ToCore();
            OrderDto orderDto = OrderDto.FromCore(order);
            return Task.FromResult<CommandResult>(new(orderDto));
        }

        protected override Task<IEnumerable<(string field, string error)>> ValidateAsync(CommandArgs args, CancellationToken cancellationToken = default)
        {
            List<(string, string)> errorList = [];

            if (!Utils.IsIso8601DateStringValid(args.NewOrder.ClientDate))
                errorList.Add(("clientDate", "Invalid value."));

            if (args.NewOrder.Items.Any(x => x.Charge is not null) && args.NewOrder.PaymentMethod is null)
                errorList.Add(("paymentMethod", "Invalid value."));

            if (args.NewOrder.Items.Any(x => x.Quantity <= 0))
                errorList.Add(("quantity", "Invalid value."));

            return Task.FromResult<IEnumerable<(string, string)>>(errorList);
        }
    }
}