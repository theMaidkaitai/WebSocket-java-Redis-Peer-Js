package org.kaitai.voice.repository;

import org.kaitai.voice.models.UserEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserEntity, String> {
}
