package org.kaitai.voice.services.room;


import org.kaitai.voice.models.RoomEntity;
import org.kaitai.voice.models.UserEntity;
import org.kaitai.voice.repository.RoomRepository;
import org.kaitai.voice.services.room.dto.RoomDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;


@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public RoomDto createRoom(RoomDto roomDto) {
        RoomEntity roomEntity = new RoomEntity(roomDto.id(),roomDto.name());
        roomRepository.save(roomEntity);
        return new RoomDto(roomDto.id(),roomDto.name());
    }

    public List<RoomEntity> getRooms() throws Exception {
        List<RoomEntity> rooms = (List<RoomEntity>) roomRepository.findAll();
        if (rooms == null || rooms.isEmpty()) {
            throw new Exception("No room entities");
        }
        return rooms;
    }


    public String addUser (String userId, String roomId) throws Exception {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new Exception("Комната не найдена"));
        room.pushUser(userId);
        roomRepository.save(room);
        return userId;
    }


    public String deleteUser (String userId, String roomId) throws Exception {
        RoomEntity room = roomRepository.findById(roomId) // находим руму из которой надо удалить
                .orElseThrow(() -> new Exception("Комната не найдена"));
        room.removeUser(userId);
        roomRepository.save(room);
        return userId;
    }

    public Set<String> getUsersInRoom (String roomId) throws Exception { // вызывать каждый раз при отрисовке сделай так ага
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new Exception("Комната не найдена"));
        return room.getUsersId();
    }


}
