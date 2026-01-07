package ClientManageServer;

// Spring Webのアノテーション（窓口の設定用）
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Springの依存注入（Autowired用）
import org.springframework.beans.factory.annotation.Autowired;
@RestController
@ServerEndpoint("/rooms") // 共通のURLの頭（/rooms/join など）
public class roomController {

    @Autowired
    private roomService roomService; // 処理の担当者を呼ぶ

    @ServerEndpoint("/join")
    public String join (@RequestBody JoinRequest request) {
        return roomService.joinProcess(request);
    }

    @ServerEndpoint("/setRlue")
    public String setRule (@RequestBody JoinRequest request) {return roomService.setRule(request);
    }
    
}
