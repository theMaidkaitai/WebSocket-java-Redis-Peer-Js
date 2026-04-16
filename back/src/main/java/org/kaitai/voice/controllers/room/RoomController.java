package org.kaitai.voice.controllers.room;


import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.models.UserEntity;
import org.kaitai.voice.repository.RoomRepository;
import org.kaitai.voice.repository.UserRepository;
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
    @Autowired
    private UserRepository userRepository;

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
            roomService.addUser(dto.userId(), dto.roomId());
            List<RoomEntity> allRooms = roomService.getRooms();

            messagingTemplate.convertAndSend("/topic/rooms/get/all", allRooms);

            List<UserEntity> usersInRoom = roomService.getAllUsersInRooms(dto.roomId());
            messagingTemplate.convertAndSend("/topic/rooms/get/users/all", usersInRoom);


        } catch (Exception e) {
            throw new MessagingException(e.getMessage());
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

    @MessageMapping("/rooms/delete/user")
    @SendTo("/topic/rooms/delete/user")
    public void deleteUser(@RequestBody RoomIdsDto userDeleteDto) {
        try {
            //String result = roomService.deleteUser(userDeleteDto.userId(), userDeleteDto.roomId());
           roomService.deleteUser(userDeleteDto.userId(), userDeleteDto.roomId());

            List<RoomEntity> allRooms = roomService.getRooms();
            messagingTemplate.convertAndSend("/topic/rooms/get/all", allRooms);

//            List<UserEntity> usersInRoom = roomService.getAllUsersInRooms(userDeleteDto.roomId());
//            messagingTemplate.convertAndSend("/topic/rooms/get/users/all", usersInRoom);

           //return result;
        }
        catch (IllegalArgumentException e) {
            throw new MessagingException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    
}
