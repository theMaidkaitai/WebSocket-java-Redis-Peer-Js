package org.kaitai.voice.models;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;


@Data
@RedisHash("room")
public class RoomEntity implements Serializable {

    private String id;
    private String name;
    private Integer maxPeople = 3;
    private Set<String> usersId = new  HashSet<>();


    public RoomEntity(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public RoomEntity() {
    }
    public void pushUser(String userId) {
        usersId.add(userId);
    }
    public void removeUser(String userId) {
        usersId.remove(userId);
    }
}
