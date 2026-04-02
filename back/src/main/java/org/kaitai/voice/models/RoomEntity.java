package org.kaitai.voice.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Data
@RedisHash("room")
@NoArgsConstructor
public class RoomEntity implements Serializable {

    private String id;
    private String name;
    private Integer maxPeople = 3;
    private Set<String> usersId = new HashSet<>();


    public RoomEntity(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
    }

    public void pushUser(String userId) {
        usersId.add(userId);
    }

    public void removeUser(String userId) {
        usersId.remove(userId);
    }

}
