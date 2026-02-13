package org.kaitai.voice.controllers.room;


import org.kaitai.voice.controllers.room.dto.AddUserDto;
import org.kaitai.voice.controllers.user.dto.UserDeleteDto;
import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.services.room.RoomService;
import org.kaitai.voice.services.room.dto.RoomDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Set;

@Controller
public class RoomController {

    @Autowired private RoomService roomService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/create/room")
    @SendTo("/topic/public")
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomDto roomDto) {
        try {
            RoomDto roomInstanse = roomService.createRoom(roomDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(roomInstanse);
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
    }


    @MessageMapping("/get/rooms")
    @SendTo("/topic/rooms")
    public ResponseEntity<List<RoomEntity>> getAll() {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(roomService.getRooms());
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @MessageMapping("/add/user/room")
    @SendTo("/topic/public")
    public ResponseEntity<String> addUserToRoom(@RequestBody AddUserDto dto) {
        try {
            String result = roomService.addUser(dto.userId(), dto.roomId());
            messagingTemplate.convertAndSend("/topic/public",
                    ResponseEntity.status(HttpStatus.CREATED).body(result));


            return ResponseEntity.status(HttpStatus.CREATED).body(roomService.addUser(dto.userId(), dto.roomId()));
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/delete/user/room")
    @SendTo("/topic/public")
    public ResponseEntity<String> deleteUser(@RequestBody UserDeleteDto userDeleteDto) {
        try {
            String result = roomService.addUser(userDeleteDto.userId(), userDeleteDto.roomId());
            messagingTemplate.convertAndSend("/topic/public",
                    ResponseEntity.status(HttpStatus.CREATED).body(result));

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(roomService.deleteUser(userDeleteDto.userId(), userDeleteDto.roomId()));
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/get/users/room")
    @SendTo("/topic/room/users/all")
    public ResponseEntity<String> getUsersInRoom(@RequestBody String roomId) {
        try {
            Set<String> result = roomService.getUsersInRoom(roomId);
            messagingTemplate.convertAndSend("/topic/public",
                    ResponseEntity.status(HttpStatus.CREATED).body(result.toString()));

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(result.toString());
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
