package org.kaitai.voice.controllers.room;


import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.models.UserEntity;
import org.kaitai.voice.repository.RoomRepository;
import org.kaitai.voice.services.room.RoomService;
import org.kaitai.voice.services.room.dto.RoomIdsDto;
import org.kaitai.voice.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class RoomController {

    @Autowired private RoomService roomService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserService userService;

    @MessageMapping("/rooms/actions/create")
    @SendTo("/topic/rooms/get/created/data")
    public RoomEntity createRoom(@RequestBody String roomName) {
        try {
            RoomEntity roomInstanse = roomService.createRoom(roomName);
            messagingTemplate.convertAndSend("/topic/rooms/get/all", roomRepository.findAll());
            messagingTemplate.convertAndSend("/topic/rooms/get/created/data", roomRepository.findById(roomInstanse.getId()));
            System.out.println("ROOM CREATED: " + roomInstanse);
            return roomInstanse;
        }
        catch (IllegalArgumentException e) {
            throw new MessagingException(e.getMessage());
        }
    }


    @MessageMapping("/rooms/get/all")
    @SendTo("/topic/rooms/get/all")
    public List<RoomEntity> getAll() {
        try {
            List<RoomEntity> rooms = roomService.getRooms();
            System.out.println("All ROOMS" + rooms);
            return rooms;
        }
        catch (IllegalArgumentException e) {
            throw new MessagingException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @MessageMapping("/rooms/user/action/connect")
    @SendTo("/topic/rooms/user/action/connect")
    public void addUserToRoom(@RequestBody RoomIdsDto dto) {
        try {
            //messagingTemplate.convertAndSend("/topic/rooms/user/action/connect", result);
            roomService.addUser(dto.userId(), dto.roomId());
            List<RoomEntity> allRooms = roomService.getRooms();
            messagingTemplate.convertAndSend("/topic/rooms/get/all", allRooms);
        }
        catch (IllegalArgumentException e) {
            throw new MessagingException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/rooms/get/users/all")
    @SendTo("/topic/rooms/get/users/all")
    public List<UserEntity> getAllUsersInRoom(@RequestBody String roomId) {
        try {
            List<UserEntity> users = roomService.getAllUsersInRooms(roomId);
            System.out.println("All USERS IN ROOM\n" + roomId + "USERS:\n" + users);
            return users;
        }
        catch (IllegalArgumentException e) {
            throw new MessagingException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

//    @MessageMapping("/delete/user/room")
//    @SendTo("/topic/public")
//    public ResponseEntity<String> deleteUser(@RequestBody RoomIdsDto userDeleteDto) {
//        try {
//            String result = roomService.deleteUser(userDeleteDto.userId(), userDeleteDto.roomId());
//            messagingTemplate.convertAndSend("/topic/public",
//                    ResponseEntity.status(HttpStatus.CREATED).body(result));
//
//            return ResponseEntity.status(HttpStatus.ACCEPTED).body(roomService.deleteUser(userDeleteDto.userId(), userDeleteDto.roomId()));
//        }
//        catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }

//    @MessageMapping("/voice/get/all/rooms/users")
//    @SendTo("/topic/room/users/all")
//    public ResponseEntity<String> getUsersInRoom(@RequestBody String roomId) {
//        try {
//            Set<String> result = roomService.getUsersInRoom(roomId);
//            messagingTemplate.convertAndSend("/topic/room/users/all",
//                    ResponseEntity.status(HttpStatus.CREATED).body(result));
//
//            return ResponseEntity.status(HttpStatus.ACCEPTED).body(result.toString());
//        }
//        catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }


}
