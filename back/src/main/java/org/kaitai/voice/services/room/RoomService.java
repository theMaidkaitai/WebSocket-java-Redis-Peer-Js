package org.kaitai.voice.services.room;


import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.models.UserEntity;
import org.kaitai.voice.repository.RoomRepository;
import org.kaitai.voice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

    public RoomEntity createRoom(String roomName) {
        RoomEntity room = new RoomEntity(roomName);
        roomRepository.save(room);
        return room;
    }


    public List<RoomEntity> getRooms() throws Exception {
        List<RoomEntity> rooms = (List<RoomEntity>) roomRepository.findAll();
        if (rooms == null || rooms.isEmpty()) {
            throw new Exception("No room entities");
        }
        return rooms;
    }

    public RoomEntity getOneRoom (String roomName) throws Exception {
        RoomEntity room = roomRepository.findByName(roomName);
        if (room == null) {
            throw new Exception("Room does not exist");
        }
        return room;
    }


    public void addUser (String userId, String roomId) throws Exception {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new Exception("Комната не найдена"));
        room.pushUser(userId);
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("Юзер не найден"));
        user.setRoomId(room.getId());

        userRepository.save(user);
        roomRepository.save(room);
    }


    public String deleteUser (String userId, String roomId) throws Exception { // TODO: refactor
        RoomEntity room = roomRepository.findById(roomId) // находим руму из которой надо удалить
                .orElseThrow(() -> new Exception("Комната не найдена"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("Юзер не найден"));

        user.setRoomId(null);
        userRepository.save(user);

        room.removeUser(userId);
        roomRepository.save(room);

        return userId;
    }

    public List<UserEntity> getAllUsersInRooms (String roomId) throws Exception {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new Exception("Комната не найдена"));
        List <UserEntity> users = new ArrayList<>();

        for (String userId : room.getUsersId()) {
            userRepository.findById(userId).ifPresent(users::add);
        }

        return users;
    }


}
