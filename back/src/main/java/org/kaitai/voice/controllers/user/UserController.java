package org.kaitai.voice.controllers.user;


import org.kaitai.voice.controllers.user.dto.UserDeleteDto;
import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.models.UserEntity;
import org.kaitai.voice.repository.RoomRepository;
import org.kaitai.voice.repository.UserRepository;
import org.kaitai.voice.services.room.RoomService;
import org.kaitai.voice.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    UserRepository userRepository;


    @MessageMapping("/create/user")
    @SendTo("/topic/public")
    public ResponseEntity<UserEntity> createUser(@RequestBody String id) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(id));
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @MessageMapping("/get/user")
    @SendTo("/topic/public")
    public ResponseEntity<String> getUser(@RequestBody String id) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.GetUser(id));
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
