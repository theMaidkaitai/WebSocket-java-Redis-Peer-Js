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

    public UserEntity createUser() throws Exception {
        UserEntity user = new UserEntity();
        userRepository.save(user);
        return user;
    }

    public Boolean checkUser(String id) throws Exception {
        if (userRepository.findById(id).isPresent()) {
            return true;
        }
        return false;
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



}
