package org.kaitai.voice.models;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;



@Data
@RedisHash("user")
public class UserEntity {
    private String id;


    public UserEntity(String id) {
        this.id = id;
    }


}
