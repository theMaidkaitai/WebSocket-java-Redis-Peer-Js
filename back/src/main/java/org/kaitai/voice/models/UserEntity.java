package org.kaitai.voice.models;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;


@Data
@RedisHash("user")
public class UserEntity {

    private String id;


    public UserEntity() {
        this.id = UUID.randomUUID().toString();
    }


    public String getId() {
        return id;
    }
}
