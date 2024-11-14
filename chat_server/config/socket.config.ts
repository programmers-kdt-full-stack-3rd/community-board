import { ServerOptions } from "socket.io";

const options: Partial<ServerOptions> = {
	cors: {
		origin: process.env.SERVER_ADDRESS,
		credentials: true,
	},
};

export default { options };
