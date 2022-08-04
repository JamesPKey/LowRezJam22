import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import kotlinx.browser.document
import kotlinx.coroutines.delay
import org.jetbrains.compose.web.css.*
import org.jetbrains.compose.web.dom.*
import org.jetbrains.compose.web.renderComposable
import org.w3c.dom.HTMLElement
import org.w3c.dom.events.KeyboardEvent
import org.w3c.dom.get

fun main() {

    val game: Game = MainGame()

    val body = document.getElementsByTagName("body")[0] as HTMLElement

    body.addEventListener("keyup", {
        //Todo: Handle key presses
        print((it as KeyboardEvent).keyCode)
    })

    renderComposable(rootElementId = "root") {

        Div(
            attrs = {
                style {
                    property("text-align", "center")
                }
            }
        ) {


            LaunchedEffect(Unit) {
                while (true) {
                    delay(1000 / 60)
                    game.update()
                }
            }

            Header()

            Div(
                attrs = {
                    style {
                        margin(30.px)
                        width(64.px)
                        height(64.px)
                        border(width = 1.px, style = LineStyle.Solid, color = Color.black)
                    }
                }
            ) {
                Text("Game Area")
            }

        }

    }
}

@Composable
private fun Header() {
    H1 {
        Text(value = "LowRezJam22")
    }
}