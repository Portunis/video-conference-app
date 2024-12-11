
import { routeName as MainPage} from "./routes/main-page";
import { routeName as AuthPage } from './routes/auth-page'
import { routeName as NotFoundPage } from './routes/404-page'
import { routeName as RoomPage } from './routes/room-page'

export const pages = {
    MainPage,
    AuthPage,
    NotFoundPage,
    RoomPage

} as const