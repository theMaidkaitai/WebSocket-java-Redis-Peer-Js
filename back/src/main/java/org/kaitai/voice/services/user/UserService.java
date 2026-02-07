package org.kaitai.voice.services.user;


import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.models.UserEntity;
import org.kaitai.voice.repository.RoomRepository;
import org.kaitai.voice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    public UserEntity createUser(String id) throws Exception {
        UserEntity user = new UserEntity(id);
        userRepository.save(user);
        return user;
    }

    public String GetUser(String id) throws Exception {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Юзер не найден"));
        return user.getId();
    }

    public List<UserEntity> getUsersByIds(List<String> userIds) {
        List<UserEntity> users = new ArrayList<>();
        for (String userId : userIds) {
            userRepository.findById(userId).ifPresent(users::add);
        }
        return users;
    }






//    public List<UserEntity> getUsersInRoom(String roomId) {
//        RoomEntity room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
//        return getUsersByIds(new ArrayList<>(room.getUsersId()));
//    }
//
//    public UserEntity getUsersInRoom(String roomId, String userId) {
//        RoomEntity room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
//        UserEntity user = roomRepository.findById(roomId)
//                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
//        return;
//    }



}
